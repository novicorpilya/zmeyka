import { defineNuxtPlugin } from '#app'
import { useUserStore } from '@entities/user/model/store'

export default defineNuxtPlugin((nuxtApp) => {
    const userStore = useUserStore()

    // Initialize store from localStorage on client side
    if (process.client) {
        userStore.init()
    }

    // Optional: Global middleware for route protection could be added here
    // or in the definePageMeta of specific pages.
})
