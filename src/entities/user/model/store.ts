import { defineStore } from 'pinia'

import type { User } from '~/shared/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isInitialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user?.role || 'STUDENT',
    userName: (state) => state.user?.name || 'Друг',
  },

  actions: {
    /**
     * Set user and sync with cookies
     */
    setUser(user: User | null, accessToken: string | null = null, remember: boolean = true) {
      this.user = user

      const userCookie = useCookie<string | null>('user_data', {
        path: '/',
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
        sameSite: 'strict',
      })

      const tokenCookie = useCookie<string | null>('access_token', {
        path: '/',
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
        sameSite: 'strict',
      })

      if (user) {
        userCookie.value = JSON.stringify(user)
      } else {
        userCookie.value = null
      }

      if (accessToken) {
        tokenCookie.value = accessToken
      } else if (user === null) {
        tokenCookie.value = null
      }
    },

    /**
     * Clear all session data
     */
    clearUser() {
      this.user = null
      const accessToken = useCookie('access_token')
      const userData = useCookie('user_data')
      accessToken.value = null
      userData.value = null
    },

    /**
     * Hydrate store from secure cookie
     */
    initStore() {
      if (this.isInitialized) return

      const userCookie = useCookie<unknown>('user_data')

      if (userCookie.value) {
        try {
          const rawData =
            typeof userCookie.value === 'string' ? JSON.parse(userCookie.value) : userCookie.value

          if (rawData && typeof rawData === 'object') {
            // Crucial: JSON.parse(JSON.stringify()) ensures we have a plain JS object
            // and strips any symbols/prototypes that break Nuxt serialization
            this.user = JSON.parse(JSON.stringify(rawData))
          }
        } catch (e) {
          console.error('Store init error:', e)
          this.clearUser()
        }
      }

      this.isInitialized = true
    },
  },
})
