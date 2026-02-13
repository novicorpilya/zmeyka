import { useUserStore } from '@entities/user/model/store'

export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()
  userStore.initStore()

  // If not authenticated, redirect to login
  if (!userStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
