<template>
  <main class="overflow-x-hidden">
    <HeroSection :start-route="startRoute" />
    <FeaturesSection />
    <ProcessSection />
    <PricingSection />
    <FaqSection />
    <CtaSection :start-route="startRoute" />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useUserStore } from '@entities/user/model/store'
import CtaSection from '~/widgets/landing/CtaSection.vue'
import FaqSection from '~/widgets/landing/FaqSection.vue'
import FeaturesSection from '~/widgets/landing/FeaturesSection.vue'
import HeroSection from '~/widgets/landing/HeroSection.vue'
import PricingSection from '~/widgets/landing/PricingSection.vue'
import ProcessSection from '~/widgets/landing/ProcessSection.vue'

const userStore = useUserStore()
const startRoute = computed(() => (userStore.isAuthenticated ? '/dashboard' : '/register'))

// SEO Meta management
useHead({
  title: 'Zmeyka — Твой интерактивный ИИ-наставник в мире IT',
  meta: [
    {
      name: 'description',
      content:
        'Освой Python и основы IT с помощью самого доброго в мире ИИ-наставника. Мгновенная проверка кода, геймификация и личный диплом.',
    },
    {
      name: 'keywords',
      content:
        'курсы программирования, python для новичков, обучение ИИ, змейка обучение, IT школа',
    },
    { property: 'og:title', content: 'Zmeyka — Учись кодить играя' },
    {
      property: 'og:description',
      content:
        'Интерактивная платформа с ИИ-проверкой домашних заданий. Начни бесплатно прямо сейчас!',
    },
    { property: 'og:url', content: 'https://zmeyka.io' },
    { property: 'og:image', content: 'https://zmeyka.io/og-image.png' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://zmeyka.io/og-image.png' },
  ],
  link: [{ rel: 'canonical', href: 'https://zmeyka.io' }],
  htmlAttrs: { lang: 'ru' },
})
</script>

<style>
/* Global landing styles if any, but mostly encapsulated in components */
html {
  scroll-behavior: smooth;
}
</style>
