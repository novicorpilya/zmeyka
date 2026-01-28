<template>
  <div class="selection:bg-brand-green/30 relative min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav 
      class="sticky top-0 z-50 transition-all duration-700 ease-in-out px-4 py-4 pointer-events-none"
    >
      <div 
        class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between transition-all duration-500 ease-in-out pointer-events-auto"
        :class="scrolled ? 'bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50' : 'bg-transparent'"
      >
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group text-decoration-none focus:outline-none">
          <div class="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center transition-all group-hover:scale-110">
            <img src="~/assets/logo.png" alt="Змейка Логотип" class="w-full h-full object-contain filter drop-shadow-sm" />
          </div>
          <span class="text-xl md:text-2xl font-black tracking-tight text-slate-800 uppercase group-hover:text-brand-green transition-colors">Змейка</span>
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-1 bg-white/30 backdrop-blur-sm p-1 rounded-2xl border border-white/20 shadow-sm">
          <a v-for="link in [
            { id: 'features', text: 'Преимущества', color: 'brand-green' },
            { id: 'process', text: 'Как это работает', color: 'brand-blue' },
            { id: 'pricing', text: 'Цены', color: 'brand-orange' },
            { id: 'faq', text: 'FAQ', color: 'brand-yellow' }
          ]" :key="link.id" 
             href="javascript:void(0)"
             @click.prevent="scrollToSection(link.id)"
             class="px-5 py-2 rounded-xl text-slate-600 font-bold hover:bg-white transition-all text-sm whitespace-nowrap"
             :class="[`hover:text-${link.color}`]"
          >
            {{ link.text }}
          </a>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center gap-4">
          <NuxtLink 
            :to="userStore.isLoggedIn ? '/dashboard' : '/auth/login'" 
            class="bg-brand-green px-6 py-2.5 rounded-2xl font-black text-white text-sm shadow-[0_5px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none transition-all btn-bouncy text-decoration-none"
          >
            {{ userStore.isLoggedIn ? 'В кабинет' : 'Войти' }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>

    <!-- Super Footer -->
    <footer class="bg-white border-t-4 border-slate-100 pt-24 pb-12 px-6 mt-32 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-brand-yellow/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        <!-- Brand Column -->
        <div class="md:col-span-4 space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 flex items-center justify-center">
              <img src="~/assets/logo.png" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <span class="text-2xl font-black text-slate-800 uppercase">Змейка</span>
          </div>
          <p class="text-slate-500 font-bold leading-relaxed max-w-sm">
            Мы верим, что программирование — это творчество, а не зубрежка. Наш ИИ-помощник делает обучение таким же увлекательным, как любимая игра.
          </p>
          <div class="flex gap-4 pt-4">
             <a href="#" class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl hover:bg-brand-blue hover:text-white hover:rotate-6 transition-all shadow-sm border-2 border-slate-100">✈️</a>
             <a href="#" class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl hover:bg-pink-500 hover:text-white hover:-rotate-6 transition-all shadow-sm border-2 border-slate-100">📸</a>
             <a href="#" class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl hover:bg-brand-orange hover:text-white hover:rotate-6 transition-all shadow-sm border-2 border-slate-100">🐱</a>
          </div>
        </div>

        <!-- Links Columns -->
        <div class="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
           <div>
            <h4 class="font-black text-slate-800 mb-6 uppercase tracking-wider text-sm">Навигация</h4>
            <ul class="space-y-4 font-bold text-slate-500">
              <li><a @click.prevent="scrollToSection('features')" href="javascript:void(0)" class="hover:text-brand-green transition-colors">Преимущества</a></li>
              <li><a @click.prevent="scrollToSection('process')" href="javascript:void(0)" class="hover:text-brand-green transition-colors">Как это работает</a></li>
              <li><a @click.prevent="scrollToSection('pricing')" href="javascript:void(0)" class="hover:text-brand-green transition-colors">Стоимость</a></li>
              <li><a @click.prevent="scrollToSection('faq')" href="javascript:void(0)" class="hover:text-brand-green transition-colors">Вопросы</a></li>
            </ul>
           </div>
           
           <div>
            <h4 class="font-black text-slate-800 mb-6 uppercase tracking-wider text-sm">Продукт</h4>
            <ul class="space-y-4 font-bold text-slate-500">
              <li><a href="#" class="hover:text-brand-blue transition-colors">Для школ (B2B)</a></li>
              <li><a href="#" class="hover:text-brand-blue transition-colors">Сертификация</a></li>
              <li><a href="#" class="hover:text-brand-blue transition-colors">Карьера</a></li>
              <li><span class="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green text-xs rounded-full">Coming Soon</span></li>
            </ul>
           </div>

           <div>
            <h4 class="font-black text-slate-800 mb-6 uppercase tracking-wider text-sm">Правовое</h4>
            <ul class="space-y-4 font-bold text-slate-500">
              <li><a href="#" class="hover:text-slate-800 transition-colors">Оферта</a></li>
              <li><a href="#" class="hover:text-slate-800 transition-colors">Приватность</a></li>
              <li><a href="#" class="hover:text-slate-800 transition-colors">Cookie Policy</a></li>
            </ul>
           </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto mt-20 pt-10 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-slate-400">
        <div>© 2026 Змейка Платформа. All rights reserved.</div>
        <div class="group relative px-6 py-3 rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(34,197,94,0.15)] transition-all duration-500 hover:-translate-y-1 cursor-none-container overflow-hidden flex items-center gap-3">
           <!-- Animated Background Glow -->
           <div class="absolute -inset-x-10 inset-y-0 bg-gradient-to-r from-transparent via-brand-green/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

           <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">From</span>
           
           <span class="relative">
              <span class="text-lg font-black tracking-tighter drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 group-hover:from-brand-green group-hover:to-brand-blue transition-all duration-500">Ilai</span>
              <!-- Underline Glow -->
              <div class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-green to-brand-blue group-hover:w-full transition-all duration-500 rounded-full"></div>
           </span>

           <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">with</span>

           <div class="relative flex items-center justify-center">
              <span class="text-xl animate-pulse group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">❤️</span>
              <!-- Sparkle particles -->
              <div class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-[8px] animate-ping text-yellow-400">✨</span>
              </div>
           </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useUserStore } from '@entities/user/model/store'

const userStore = useUserStore()

// Scroll detection for navbar styling
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const navHeight = 100 // Height of our floating nav
    const elementPosition = el.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - navHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
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
