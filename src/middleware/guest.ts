import { useUserStore } from '@entities/user/model/store'

export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()
  userStore.initStore()

  // If authenticated, redirect to dashboard
  if (userStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
