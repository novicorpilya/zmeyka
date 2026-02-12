<template>
  <main class="overflow-x-hidden">
    <UltraHeroSection :start-route="startRoute" />
    <ClientOnly placeholder-tag="section">
      <InteractiveSandbox />
      <template #fallback>
        <section class="py-24 bg-slate-900 flex items-center justify-center">
          <div
            class="w-full max-w-6xl mx-auto h-[450px] bg-slate-800/50 rounded-[2rem] animate-pulse flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-sm"
          >
            Загрузка интерактивной песочницы...
          </div>
        </section>
      </template>
    </ClientOnly>
    <FeaturesSection />
    <ProcessSection />
    <PricingSection />
    <TestimonialsSection />
    <FaqSection />
    <ContactSection />
    <UltraCtaSection :start-route="startRoute" />
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from '@entities/user/model/store'
import { computed } from 'vue'

import ContactSection from '~/widgets/landing/ContactSection.vue'
import FaqSection from '~/widgets/landing/FaqSection.vue'
import FeaturesSection from '~/widgets/landing/FeaturesSection.vue'
import InteractiveSandbox from '~/widgets/landing/InteractiveSandbox.vue'
import PricingSection from '~/widgets/landing/PricingSection.vue'
import ProcessSection from '~/widgets/landing/ProcessSection.vue'
import TestimonialsSection from '~/widgets/landing/TestimonialsSection.vue'
import UltraCtaSection from '~/widgets/landing/UltraCtaSection.vue'
import UltraHeroSection from '~/widgets/landing/UltraHeroSection.vue'

const userStore = useUserStore()
const startRoute = computed(() => (userStore.isAuthenticated ? '/dashboard' : '/register'))

// Modern SEO Meta management
useSeoMeta({
  title: 'Змейка — Твой интерактивный ИИ-наставник в мире IT',
  description:
    'Освой Python и основы IT с помощью самого доброго в мире ИИ-наставника. Мгновенная проверка кода, геймификация и личный диплом.',
  ogTitle: 'Змейка — Учись кодить играя',
  ogDescription:
    'Интерактивная платформа с ИИ-проверкой домашних заданий. Начни бесплатно прямо сейчас!',
  ogUrl: 'https://zmeyka.ru',
  ogImage: 'https://zmeyka.ru/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://zmeyka.ru/og-image.png',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://zmeyka.ru' }],
  htmlAttrs: { lang: 'ru' },
})

definePageMeta({
  layout: 'default',
})
</script>

<style>
/* Global landing styles if any, but mostly encapsulated in components */
</style>
