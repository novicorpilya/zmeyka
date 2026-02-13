<template>
  <ErrorBoundary>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <TheToasts />
    <TheModals />
    <TheCommandPalette />
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useUserStore } from '@entities/user/model/store'
import ErrorBoundary from '@shared/ui/ErrorBoundary.vue'
import TheCommandPalette from '@shared/ui/TheCommandPalette.vue'
import TheModals from '@shared/ui/TheModals.vue'
import TheToasts from '@shared/ui/TheToasts.vue'

// GSAP setup
if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const userStore = useUserStore()
// Initialize store once globally to enable SSR hydration of user state
userStore.initStore()

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap',
    },
  ],
})
</script>

<style>
/* Global styles are in app/index.css */
</style>
