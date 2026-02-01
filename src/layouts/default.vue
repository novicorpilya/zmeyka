<template>
  <div class="selection:bg-emerald-500/10 min-h-screen flex flex-col bg-white">
    <!-- Navbar -->
    <nav
      class="fixed top-0 w-full z-[100] px-6 py-8 transition-all duration-500 pointer-events-none"
    >
      <div
        class="max-w-7xl mx-auto flex items-center justify-between p-3 pointer-events-auto transition-all duration-500"
        :class="
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border border-slate-100 shadow-premium rounded-3xl p-4'
            : 'bg-transparent'
        "
      >
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group focus:outline-none">
          <div class="w-10 h-10 group-hover:scale-110 transition-transform">
            <img src="~/assets/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <span class="text-xl font-black text-slate-900 tracking-tighter uppercase">Змейка</span>
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-2">
          <button
            v-for="link in [
              { id: 'features', text: 'Преимущества' },
              { id: 'process', text: 'Процесс' },
              { id: 'pricing', text: 'Тарифы' },
              { id: 'faq', text: 'FAQ' },
            ]"
            :key="link.id"
            @click="scrollToSection(link.id)"
            class="px-6 py-2 rounded-xl text-slate-500 font-bold hover:text-emerald-500 hover:bg-emerald-50/50 transition-all text-xs uppercase tracking-widest"
          >
            {{ link.text }}
          </button>
        </div>

        <!-- Auth -->
        <div class="flex items-center">
          <NuxtLink
            :to="userStore.isAuthenticated ? '/dashboard' : '/login'"
            class="bg-slate-900 px-8 py-3 rounded-2xl font-black text-white text-[10px] uppercase tracking-widest hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            {{ userStore.isAuthenticated ? 'В кабинет' : 'Войти' }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="flex-grow">
      <slot />
    </main>

    <!-- Premium Footer -->
    <footer class="bg-slate-50 border-t border-slate-100 pt-32 pb-16 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div class="md:col-span-4 space-y-8">
            <div class="flex items-center gap-3">
              <img src="~/assets/logo.png" alt="Logo" class="w-10 h-10" />
              <span class="text-2xl font-black text-slate-900 tracking-tighter uppercase"
                >Змейка</span
              >
            </div>
            <p class="text-slate-500 font-medium leading-relaxed max-w-sm">
              Интерактивная платформа для тех, кто хочет войти в IT без скуки и зубрежки. Твой
              персональный наставник на базе ИИ.
            </p>
            <div class="flex gap-4">
              <a
                href="#"
                class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl hover:bg-emerald-500 hover:text-white transition-all shadow-premium border border-slate-100"
                >✈️</a
              >
              <a
                href="#"
                class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl hover:bg-emerald-500 hover:text-white transition-all shadow-premium border border-slate-100"
                >🐱</a
              >
            </div>
          </div>

          <div class="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div
              v-for="(col, i) in [
                {
                  title: 'Обучение',
                  links: [
                    { id: 'features', t: 'Преимущества' },
                    { id: 'process', t: 'Процесс' },
                    { id: 'pricing', t: 'Тарифы' },
                    { id: 'faq', t: 'FAQ' },
                  ],
                },
                {
                  title: 'Компания',
                  links: [
                    { id: '', t: 'О нас' },
                    { id: '', t: 'Школам' },
                    { id: '', t: 'Карьера' },
                  ],
                },
                {
                  title: 'Юрид.',
                  links: [
                    { id: '', t: 'Приватность' },
                    { id: '', t: 'Оферта' },
                    { id: '', t: 'Cookie' },
                  ],
                },
              ]"
              :key="i"
              class="space-y-8"
            >
              <h4
                class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 border-b border-slate-200 pb-4 inline-block font-inter"
              >
                {{ col.title }}
              </h4>
              <ul class="space-y-4">
                <li v-for="link in col.links" :key="link.t">
                  <button
                    v-if="link.id"
                    @click="scrollToSection(link.id)"
                    class="text-slate-500 font-medium hover:text-emerald-500 transition-colors text-sm text-left"
                  >
                    {{ link.t }}
                  </button>
                  <a
                    v-else
                    href="#"
                    class="text-slate-500 font-medium hover:text-emerald-500 transition-colors text-sm"
                    >{{ link.t }}</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-200/50 text-slate-400 font-bold text-xs uppercase tracking-widest font-inter"
        >
          <div>© 2026 ZMEYKA.IO PLATFORM</div>
          <div class="flex items-center gap-2">
            MADE BY
            <span class="text-slate-900 font-black tracking-tighter">ILAI NOVIKOV</span> WITH 💚
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { useUserStore } from '~/entities/user/model/store'

const userStore = useUserStore()
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const offset = 100
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = el.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.shadow-premium {
  box-shadow: 0 10px 15px -10px rgba(0, 0, 0, 0.05);
}
</style>
