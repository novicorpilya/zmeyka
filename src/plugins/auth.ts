import { useUserStore } from '@entities/user/model/store'

export default defineNuxtPlugin((_nuxtApp) => {
  const userStore = useUserStore()
  userStore.initStore()
})
