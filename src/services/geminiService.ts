import { useRuntimeConfig, useCookie } from '#app'

export interface ReviewResult {
  feedback: string
  score: number
  fix?: string | null
}

/**
 * Service for interacting with the backend AI proxy (Gemini/Ollama)
 * PREVENTS LEAKING API KEYS TO THE FRONTEND.
 */
export const useGeminiService = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('access_token')

  /**
   * Generates a review for a code submission via backend
   */
  const reviewCode = async (
    code: string,
    taskDescription: string,
  ): Promise<ReviewResult> => {
    const apiBase = config.public.apiBase
    const token = tokenCookie.value

    const url = `${apiBase}/ai/review`
    console.log('[GeminiService] Calling backend AI:', url)

    try {
      // Direct call to our backend proxy with Auth
      const response = await $fetch<any>(url, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: {
          code,
          taskDescription,
        },
      })

      return {
        feedback: response.feedback || 'AI не смог сформулировать фидбек.',
        score: response.score ?? 70,
        fix: response.socraticHints?.[0] || null, // Map hints as potential fixes/directions
      }
    } catch (error) {
      console.error('[GeminiService] Error calling backend AI:', error)
      return { feedback: 'Ошибка подключения к ИИ-наставнику.', score: 0 }
    }
  }

  return {
    reviewCode,
  }
}
