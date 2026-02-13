import { useUserStore } from '@entities/user/model/store'

export * from './gemini.service'

interface FetchError {
  response?: {
    status?: number
  }
}

// Module-level lock for token refreshing to prevent race conditions
let refreshPromise: Promise<string | null> | null = null

export const useApi = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  // Create $fetch instance ONCE per composable call, not per request
  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      options.credentials = 'include'
      const at = useCookie<string | null>('access_token')
      const token = at.value
      // Only attach if it looks like a real JWT (min length check)
      if (token && typeof token === 'string' && token.length > 20) {
        const headers = new Headers((options.headers as HeadersInit) || {})
        headers.set('Authorization', `Bearer ${token}`)
        options.headers = headers
      }
    },
  })

  return async <T = unknown>(
    request: string,
    options: Record<string, unknown> = {},
  ): Promise<T> => {
    const at = useCookie<string | null>('access_token')
    const initialToken = at.value

    try {
      return (await apiFetch(request, options)) as T
    } catch (error: unknown) {
      const responseStatus = (error as FetchError)?.response?.status

      if (responseStatus !== 401) throw error

      const url = request.toString()
      if (url.includes('/auth/refresh') || url.includes('/auth/login')) throw error

      // If the token has already changed while we were waiting for the response,
      // it means another request (or tab) already refreshed it. Just retry.
      if (at.value !== initialToken && at.value) {
        const headers = new Headers((options.headers as HeadersInit) || {})
        headers.set('Authorization', `Bearer ${at.value}`)
        return (await apiFetch(request, { ...options, headers })) as T
      }

      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              const data = await $fetch<{ accessToken: string }>(
                `${config.public.apiBase}/auth/refresh`,
                {
                  method: 'POST',
                  credentials: 'include',
                },
              )
              return data?.accessToken || null
            } catch (_err) {
              return null
            } finally {
              refreshPromise = null
            }
          })()
        }

        const newToken = await refreshPromise

        if (newToken) {
          at.value = newToken
          const headers = new Headers((options.headers as HeadersInit) || {})
          headers.set('Authorization', `Bearer ${newToken}`)
          return (await apiFetch(request, { ...options, headers })) as T
        }

        throw new Error('Refresh failed')
      } catch (refreshError: unknown) {
        // Cleanup on terminal failure
        if (at.value) {
          // Silent refresh failed, clearing user session
          at.value = null
          userStore.clearUser()
        }

        if (process.client) {
          const currentPath = window.location.pathname
          if (currentPath !== '/login') {
            navigateTo('/login')
          }
        }
        throw refreshError
      }
    }
  }
}
