import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { User } from '@shared/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isInitialized = ref(false)

  // Move cookie composables to top level
  const userCookie = useCookie<string | null>('user_data', {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days default
  })
  const tokenCookie = useCookie<string | null>('access_token', {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days default
  })

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || 'STUDENT')
  const userName = computed(() => user.value?.name || 'Друг')

  // Actions
  const setUser = (
    newUser: User | null,
    accessToken: string | null = null,
    _remember: boolean = true,
  ): void => {
    user.value = newUser
    // Removed invalid .options mutation

    if (newUser) {
      const { id, email, name, avatar, role, createdAt, updatedAt } = newUser
      userCookie.value = JSON.stringify({ id, email, name, avatar, role, createdAt, updatedAt })
    } else {
      userCookie.value = null
    }

    if (accessToken) {
      tokenCookie.value = accessToken
    } else if (newUser === null) {
      tokenCookie.value = null
    }
  }

  const clearUser = (): void => {
    user.value = null
    tokenCookie.value = null
    userCookie.value = null
  }

  const initStore = (): void => {
    if (isInitialized.value) return

    if (userCookie.value) {
      try {
        const data =
          typeof userCookie.value === 'string' ? JSON.parse(userCookie.value) : userCookie.value

        if (data && typeof data === 'object') {
          const d = data as Record<string, unknown>
          // Strict validation before assignment
          if (typeof d.id === 'string' || typeof d.id === 'number') {
            const sanitzedUser: User = {
              id: String(d.id),
              email: String(d.email || ''),
              name: d.name ? String(d.name) : undefined,
              avatar: d.avatar ? String(d.avatar) : undefined,
              role: (d.role as User['role']) || 'STUDENT',
              createdAt: String(d.createdAt || new Date().toISOString()),
              updatedAt: String(d.updatedAt || new Date().toISOString()),
            }
            user.value = sanitzedUser
          }
        }
      } catch {
        // Silent fail on invalid cookie data to prevent console noise
        clearUser()
      }
    }

    isInitialized.value = true
  }

  return {
    user,
    isInitialized,
    isAuthenticated,
    userRole,
    userName,
    setUser,
    clearUser,
    initStore,
  }
})
