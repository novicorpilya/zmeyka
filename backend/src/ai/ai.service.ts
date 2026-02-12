import {
  Injectable,
  Logger,
  OnModuleInit,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface AICheckResult {
  score: number
  feedback: string
  status: 'COMPLETED' | 'REJECTED'
  confidence: number // 0-100
  reasoning: string // Internal explanation for the teacher
  integrityScore: number // 0-100 score of code originality
  integrityReasoning: string // AI explanation of potential "cheating"
  socraticHints: string[] // GUIDANCE: Guiding questions instead of direct answers
}

export interface AIQuizQuestion {
  text: string
  options: string[]
  correctOption: number
}

export interface AIHomeworkResult {
  title: string
  task: string
  solution: string
}

@Injectable()
export class AIService implements OnModuleInit {
  private readonly logger = new Logger(AIService.name)
  private readonly ollamaHost: string
  private readonly model: string

  async onModuleInit(): Promise<void> {
    try {
      this.logger.log(`Testing Ollama connection at ${this.ollamaHost}/api/tags...`)
      const response = await globalThis.fetch(`${this.ollamaHost}/api/tags`)
      if (response.ok) {
        const data = (await response.json()) as { models?: Array<{ name: string }> }
        const modelNames = data.models?.map((m) => m.name) || []
        this.logger.log(`Ollama is UP. Available models: ${JSON.stringify(modelNames)}`)
      } else {
        this.logger.error(
          `Ollama connection test failed: ${response.status} ${response.statusText}`,
        )
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`Ollama is NOT reachable at ${this.ollamaHost}. Error: ${errorMessage}`)
      if (error instanceof Error) {
        this.logger.error(error.stack)
      }
    }
  }

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('OLLAMA_HOST') || 'http://127.0.0.1:11434'
    this.ollamaHost = host.replace(/\/$/, '')
    this.model = this.configService.get<string>('OLLAMA_MODEL') || 'llama3:latest'

    this.logger.log(`AI Service initialized with Host: ${this.ollamaHost}, Model: ${this.model}`)
  }

  /**
   * BIG TECH SECURITY: Direct code review via Gemini from the backend
   * This prevents leaking API keys to the frontend.
   */
  async reviewCodeWithGemini(code: string, taskDescription: string): Promise<AICheckResult> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is missing. Falling back to Ollama.')
      return this.analyzeHomework(taskDescription, code)
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`

    try {
      const response = await globalThis.fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful Python tutor named "Змейка". 
                Review this student's code for the following task: "${taskDescription}".
                
                Student Code:
                \`\`\`python
                ${code}
                \`\`\`
                
                Provide:
                1. A short encouraging comment (in Russian).
                2. Detailed feedback on logic or syntax errors (in Russian).
                3. A score from 0 to 100.
                4. Reasoning for the score.
                
                Format your response as a JSON object with keys: "feedback", "score", "reasoning", "status", "confidence", "integrityScore", "integrityReasoning", "socraticHints".
                "status" should be "COMPLETED" or "REJECTED".
                "socraticHints" should be an array of questions.`,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as any
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!aiText) throw new Error('Empty AI response from Gemini')

      return this.parseJsonResponse<AICheckResult>(aiText)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      this.logger.error(`Gemini Service Error: ${message}`)
      // Fallback to Ollama if Gemini fails
      return this.analyzeHomework(taskDescription, code)
    }
  }

  private parseJsonResponse<T>(rawResponse: string): T {
    try {
      let jsonStr = rawResponse.trim()

      // Strip markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr
          .replace(/^```json/, '')
          .replace(/```$/, '')
          .trim()
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim()
      }

      // Extract content between first { and last } or [ and ]
      const jsonMatch = jsonStr.match(/[{[][\s\S]*[\]}]/)
      if (jsonMatch) {
        jsonStr = jsonMatch[0]
      }

      return JSON.parse(jsonStr) as T
    } catch (error) {
      this.logger.error(`Failed to parse AI JSON response. Raw string: ${rawResponse}`)
      // Attempt even more aggressive cleanup for small models
      try {
        const cleanedArray = rawResponse.substring(
          rawResponse.indexOf('['),
          rawResponse.lastIndexOf(']') + 1,
        )
        if (cleanedArray) return JSON.parse(cleanedArray) as T

        const cleanedObject = rawResponse.substring(
          rawResponse.indexOf('{'),
          rawResponse.lastIndexOf('}') + 1,
        )
        if (cleanedObject) return JSON.parse(cleanedObject) as T
      } catch {
        // Ignore fallback parsing errors
      }
      throw new BadRequestException(
        `AI returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  async analyzeHomework(
    taskDescription: string,
    studentSolution: string,
    referenceSolution?: string,
    executionLogs: Array<{
      createdAt: string | Date
      success: boolean
      output: string | null
      error: string | null
    }> = [],
  ): Promise<AICheckResult> {
    const url = `${this.ollamaHost}/api/generate`
    const logsContext =
      executionLogs.length > 0
        ? executionLogs
            .map(
              (log) =>
                `[${log.createdAt.toString()}] ${log.success ? 'УСПЕХ' : 'ОШИБКА'}: ${log.output || log.error}`,
            )
            .join('\n')
        : 'Логи запусков отсутствуют.'

    const prompt = `
      ТЫ — SENIOR SOFTWARE ENGINEER (L6/L7). ТВОЯ ЗАДАЧА: ПРОВЕСТИ CODE REVIEW (PR).
      
      КОНТЕКСТ ЗАДАНИЯ:
      ЗАДАНИЕ: "${taskDescription}"
      РЕШЕНИЕ СТУДЕНТА: "${studentSolution}"
      ЭТАЛОН: "${referenceSolution || 'Не предоставлен'}"
      
      ИСТОРИЯ ЗАПУСКОВ КОДА (GPT-BUSTER):
      ${logsContext}

      КРИТЕРИИ CODE REVIEW:
      1. ЧИТАЕМОСТЬ: Названия переменных, PEP8.
      2. ЭФФЕКТИВНОСТЬ: Оптимальность алгоритма.
      3. ПОДЛИННОСТЬ: Проверь историю запусков. Если решение идеальное, но в логах только ошибки или пусто — это флаг 'INTEGRITY_RISK'.
      4. GUIDANCE: Не давай готовое решение.

      ВЕРДИКТЫ:
      - 'COMPLETED' (LGTM): Код отличный, работа принята.
      - 'REJECTED' (НУЖНЫ ПРАВКИ): Есть ошибки, работа требует доработки. 
      
      ИНСТРУКЦИЯ ПО SOCRATIC HINTS:
      Если работа отклонена, напиши 2-3 наводящих вопроса (socraticHints), чтобы студент СТОЛКНУЛСЯ с проблемой в своем коде и сам нашел решение.

      ОТВЕТЬ СТРОГО В JSON:
      {
        "score": number, (от 0 до 100)
        "feedback": "Технический фидбек на русском.",
        "status": "COMPLETED" | "REJECTED",
        "confidence": number,
        "reasoning": "Техническое обоснование для Team Lead (почему такой скор, была ли попытка обмана)",
        "integrityScore": number, (100 - точно сам, 0 - точно скопировал без понимания)
        "integrityReasoning": "Анализ оригинальности на основе логов",
        "socraticHints": ["вопрос 1", "вопрос 2"]
      }
    `

    try {
      const controller = new AbortController()
      const timeoutId = globalThis.setTimeout(() => controller.abort(), 60000)

      const response = await globalThis.fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          format: 'json',
        }),
        signal: controller.signal,
      })
      globalThis.clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = (await response.json()) as { response: string }
      const result = this.parseJsonResponse<AICheckResult>(data.response)

      return {
        score: result.score ?? 0,
        feedback: result.feedback || 'AI не смог сформулировать фидбек.',
        status: result.status === 'COMPLETED' ? 'COMPLETED' : 'REJECTED',
        confidence: result.confidence ?? 50,
        reasoning: result.reasoning || 'Нет пояснений.',
        integrityScore: result.integrityScore ?? 100,
        integrityReasoning:
          result.integrityReasoning || 'Проверка подлинности не дала результатов.',
        socraticHints: Array.isArray(result.socraticHints) ? result.socraticHints : [],
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`AI Analysis Error: ${errorMessage}`)
      return {
        score: 0,
        feedback: 'Служба проверки временно недоступна.',
        status: 'REJECTED',
        confidence: 0,
        reasoning: `Error: ${errorMessage}`,
        integrityScore: 0,
        integrityReasoning: 'Analysis unavailable.',
        socraticHints: [],
      }
    }
  }

  async generateQuiz(content: string): Promise<AIQuizQuestion[]> {
    const url = `${this.ollamaHost}/api/generate`
    const prompt = `
      ТЫ — ЭКСПЕРТ ПО ОБУЧЕНИЮ ПРОГРАММИРОВАНИЮ.
      ИЗУЧИ СЛЕДУЮЩИЙ КОНСПЕКТ УРОКА И СОЗДАЙ 5-7 ПРОВЕРОЧНЫХ ВОПРОСОВ.
      
      КОНТЕНТ УРОКА:
      "${content}"
      
      ТРЕБОВАНИЯ:
      1. ВОПРОСЫ ДОЛЖНЫ БЫТЬ ПО ТЕМЕ.
      2. ДЛЯ КАЖДОГО ВОПРОСА СДЕЛАЙ 4 ВАРИАНТА ОТВЕТА.
      3. ТОЛЬКО ОДИН ВАРИАНТ ПРАВИЛЬНЫЙ.
      
      ОТВЕТЬ СТРОГО В JSON МАССИВЕ (ARRAY). БЕЗ MARKDOWN.
      
      ФОРМАТ ОБЪЕКТА:
      {
        "text": "Вопрос?",
        "options": ["ответ 1", "ответ 2", "ответ 3", "ответ 4"],
        "correctOption": 0
      }
    `

    try {
      const controller = new AbortController()
      const timeoutId = globalThis.setTimeout(() => controller.abort(), 60000)

      const response = await globalThis.fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          format: 'json',
        }),
        signal: controller.signal,
      })
      globalThis.clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = (await response.json()) as { response: string }
      this.logger.log(`RAW AI RESPONSE (Quiz): ${data.response}`)
      const questions = this.parseJsonResponse<unknown>(data.response)

      // Normalization: Ensure we have an array
      const questionList = Array.isArray(questions) ? questions : [questions]

      // Deep Normalization: Ensure the structure is ALWAYS correct for the DB
      const normalizedQuestions: AIQuizQuestion[] = questionList.map(
        (q: unknown): AIQuizQuestion => {
          const question = q as Record<string, unknown>
          let options: string[] = ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4']
          if (Array.isArray(question.options)) {
            options = (question.options as unknown[]).map((opt: unknown) => {
              if (typeof opt === 'object' && opt !== null) {
                const optObj = opt as Record<string, unknown>
                return String(optObj.text || optObj.value || JSON.stringify(opt))
              }
              return String(opt)
            })
          }

          return {
            text: String(question.text || 'Новый вопрос'),
            options: options.slice(0, 4), // Ensure exactly 4 or less
            correctOption: (Number.isInteger(question.correctOption)
              ? question.correctOption
              : 0) as number,
          }
        },
      )

      return normalizedQuestions
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`AI Quiz Generation Error: ${errorMessage}`)
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(
        errorMessage.includes('invalid format')
          ? errorMessage
          : `Служба ИИ недоступна или перегружена (${this.model}). Ошибка: ${errorMessage}`,
      )
    }
  }

  async generateHomework(content: string): Promise<AIHomeworkResult> {
    const url = `${this.ollamaHost}/api/generate`
    const prompt = `
      ТЫ — LEAD DEVELOPER. ПРИДУМАЙ ИНТЕРЕСНОЕ ДОМАШНЕЕ ЗАДАНИЕ НА ОСНОВЕ ТЕМЫ УРОКА.
      
      КОНТЕНТ УРОКА:
      "${content}"
      
      ОТВЕТЬ СТРОГО В JSON:
      {
        "title": "Заголовок задания",
        "task": "Подробное описание задачи для студента",
        "solution": "Эталонный код решения на языке Python"
      }
    `

    try {
      const controller = new AbortController()
      const timeoutId = globalThis.setTimeout(() => controller.abort(), 60000)

      const response = await globalThis.fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          format: 'json',
        }),
        signal: controller.signal,
      })
      globalThis.clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = (await response.json()) as { response: string }
      return this.parseJsonResponse<AIHomeworkResult>(data.response)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`AI Homework Generation Error: ${errorMessage}`)
      throw new InternalServerErrorException(
        `Служба ИИ недоступна. Убедитесь, что Ollama запущена с моделью ${this.model}. Ошибка: ${errorMessage}`,
      )
    }
  }
}
