<template>
  <div class="min-h-screen font-nunito flex flex-col overflow-x-hidden">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted } from 'vue'

import { useUserStore } from '~/entities/user/model/store'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const userStore = useUserStore()

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

onMounted(() => {
  userStore.initStore()
})
</script>

<style>
/* Clean system behavior */
html {
  scroll-behavior: smooth;
}
</style>
