import { ref } from 'vue'

import { useBuilderApi } from '~/features/course-builder/api'
import { useToast } from '~/shared/composables/useToast'
import type { Quiz, Question } from '~/shared/types'

/**
 * Composable for quiz CRUD and AI generation in the course builder.
 */
export const useBuilderQuiz = () => {
  const builderApi = useBuilderApi()
  const toast = useToast()

  const quiz = ref<Quiz | null>(null)
  const questions = ref<Question[]>([])
  const isGeneratingAi = ref(false)
  const isGeneratingHomework = ref(false)

  const fetchQuiz = async (lessonId: string) => {
    try {
      const data = await builderApi.getQuiz(lessonId)
      if (data) {
        quiz.value = data
        questions.value = data.questions.map((q: unknown) => {
          const rawQ = q as { options: string | string[] } & Question
          return {
            ...rawQ,
            options: typeof rawQ.options === 'string' ? JSON.parse(rawQ.options) : rawQ.options,
          }
        })
      } else {
        quiz.value = null
        questions.value = []
      }
    } catch (_err) {
      // silent
    }
  }

  const createQuiz = async (lessonId: string) => {
    try {
      const data = await builderApi.ensureQuiz(lessonId)
      quiz.value = data
      questions.value = []
    } catch (_err) {
      // silent
    }
  }

  const addQuestion = async (lessonId: string) => {
    // Ensure quiz exists
    if (!quiz.value) {
      try {
        await createQuiz(lessonId)
      } catch (_err) {
        toast.error('Не удалось инициализировать тест')
        return
      }
    }
    if (!quiz.value) return

    const tempId = 'temp-' + Date.now()
    const newQBase = {
      text: 'Новый вопрос',
      options: ['Вариант 1', 'Вариант 2'],
      correctOption: 0,
    }

    // Optimistic UI push
    questions.value.push({
      id: tempId,
      ...newQBase,
    } as Question)

    try {
      const res = await builderApi.addQuestion(quiz.value.id, {
        ...newQBase,
        options: JSON.stringify(newQBase.options),
      })

      const idx = questions.value.findIndex((q) => q.id === tempId)
      if (idx !== -1) {
        questions.value[idx] = {
          ...res,
          options: typeof res.options === 'string' ? JSON.parse(res.options) : res.options,
        }
      }
    } catch (_err) {
      questions.value = questions.value.filter((q) => q.id !== tempId)
      toast.error('Ошибка при сохранении вопроса')
    }
  }

  const updateQuestion = async (q: Question) => {
    try {
      await builderApi.updateQuestion(q.id, {
        text: q.text,
        options: JSON.stringify(q.options),
        correctOption: q.correctOption,
      })
      toast.success('Сохранено')
    } catch (_err) {
      toast.error('Ошибка при обновлении вопроса')
    }
  }

  const deleteQuestion = async (
    id: string,
    confirmFn: (title: string, message: string) => Promise<boolean>,
  ) => {
    if (
      !(await confirmFn('Удалить вопрос?', 'Вы уверены, что хотите убрать этот вопрос из теста?'))
    )
      return

    const originalQuestions = [...questions.value]
    questions.value = questions.value.filter((q) => q.id !== id)

    try {
      await builderApi.deleteQuestion(id)
      toast.success('Вопрос удален', 5000, {
        label: 'Отменить',
        handler: async () => {
          const q = originalQuestions.find((it) => it.id === id)
          if (q) {
            const res = await builderApi.addQuestion(quiz.value!.id, {
              text: q.text,
              options: JSON.stringify(q.options),
              correctOption: q.correctOption,
            })
            questions.value.push({
              ...res,
              options: typeof res.options === 'string' ? JSON.parse(res.options) : res.options,
            })
            toast.info('Восстановлено')
          }
        },
      })
    } catch (_err) {
      questions.value = originalQuestions
      toast.error('Ошибка при удалении вопроса')
    }
  }

  const generateAiQuiz = async (lessonId: string) => {
    isGeneratingAi.value = true
    try {
      const newQuestions = await builderApi.generateAiQuiz(lessonId)
      questions.value = newQuestions
      toast.success('Тест успешно сгенерирован ИИ')
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } }
      const message = apiErr.data?.message || 'Не удалось сгенерировать тест'
      toast.error(typeof message === 'string' ? message : 'Ошибка сервиса ИИ')
    } finally {
      isGeneratingAi.value = false
    }
  }

  const generateAiHomework = async (
    lessonId: string,
    onSuccess: (result: {
      homeworkTitle?: string
      homeworkTask?: string
      homeworkSolution?: string
    }) => void,
  ) => {
    isGeneratingHomework.value = true
    try {
      const updatedLesson = await builderApi.generateAiHomework(lessonId)
      onSuccess(updatedLesson)
      toast.success('Задание успешно сгенерировано ИИ')
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } }
      const message = apiErr.data?.message || 'Не удалось сгенерировать задание'
      toast.error(typeof message === 'string' ? message : 'Ошибка сервиса ИИ')
    } finally {
      isGeneratingHomework.value = false
    }
  }

  return {
    quiz,
    questions,
    isGeneratingAi,
    isGeneratingHomework,
    fetchQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    generateAiQuiz,
    generateAiHomework,
  }
}
