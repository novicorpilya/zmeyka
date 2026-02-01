// eslint-disable-next-line boundaries/element-types
import { useUserStore } from '~/entities/user/model/store'

// Module-level lock for token refreshing to prevent race conditions
let refreshPromise: Promise<string | null> | null = null

export const useApi = () => {
  const config = useRuntimeConfig()
  const accessToken = useCookie<string | null>('access_token')
  const userStore = useUserStore()

  // Internal fetcher configuration
  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      options.credentials = 'include'
      // We only set the header if the token is available and it's not an HttpOnly cookie
      // In many cases with HttpOnly cookies, the browser handles this automatically.
      if (accessToken.value) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${accessToken.value}`)
        options.headers = headers
      }
    },
  })

  /**
   * Custom wrapper to handle 401 and transparent retry
   */
  return async <T = unknown>(
    request: string,
    options: Record<string, unknown> = {},
  ): Promise<T> => {
    try {
      return await apiFetch(request, options)
    } catch (error: unknown) {
      const responseStatus = (error as { response?: { status?: number } })?.response?.status

      // If not unauthorized or it's an auth-related request, bubble up the error
      if (responseStatus !== 401) throw error

      const url = request.toString()
      if (url.includes('/auth/refresh') || url.includes('/auth/login')) throw error

      try {
        // If a refresh is already in progress, wait for it instead of starting a new one
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
          accessToken.value = newToken
          // Retry original request with the new token in headers
          const headers = new Headers((options.headers as HeadersInit) || {})
          headers.set('Authorization', `Bearer ${newToken}`)
          return await apiFetch(request, { ...options, headers })
        }

        throw new Error('Refresh failed')
      } catch (refreshError: unknown) {
        // Cleanup on terminal failure
        accessToken.value = null
        userStore.clearUser()

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
