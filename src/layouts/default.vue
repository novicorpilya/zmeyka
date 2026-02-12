<template>
  <div class="selection:bg-emerald-500/10 min-h-screen flex flex-col bg-white">
    <!-- Navbar -->
    <nav
      class="fixed top-0 w-full z-[120] px-4 md:px-6 py-4 md:py-6 transition-all duration-500 pointer-events-none"
    >
      <div
        class="max-w-7xl mx-auto flex items-center justify-between p-2 md:p-3 pointer-events-auto transition-all duration-500"
        :class="
          scrolled || mobileMenuOpen
            ? 'bg-white/90 backdrop-blur-xl border border-slate-100 shadow-premium rounded-[2rem] md:rounded-3xl'
            : 'bg-transparent'
        "
      >
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2 group focus:outline-none shrink-0 relative z-[110]"
        >
          <div
            class="w-10 h-10 md:w-16 md:h-16 shrink-0 group-hover:scale-110 transition-transform"
          >
            <img :src="logoImage" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <span class="text-lg md:text-3xl font-black text-slate-900 tracking-tighter uppercase"
            >Змейка</span
          >
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="hidden xl:flex items-center gap-1">
          <button
            v-for="link in [
              { id: 'features', text: 'Преимущества' },
              { id: 'process', text: 'Процесс' },
              { id: 'pricing', text: 'Тарифы' },
              { id: 'testimonials', text: 'Отзывы' },
              { id: 'faq', text: 'FAQ' },
              { id: 'contact', text: 'Контакты' },
            ]"
            :key="link.id"
            @click="scrollToSection(link.id)"
            class="px-3 py-2 rounded-xl text-slate-500 font-bold hover:text-emerald-500 hover:bg-emerald-50/50 transition-all text-[11px] uppercase tracking-widest whitespace-nowrap"
          >
            {{ link.text }}
          </button>
        </div>

        <!-- Desktop Menu (Intermediate Laptop size) -->
        <div class="hidden lg:flex xl:hidden items-center gap-0.5">
          <button
            v-for="link in [
              { id: 'features', text: 'Зачем' },
              { id: 'process', text: 'Как' },
              { id: 'pricing', text: 'Цены' },
              { id: 'testimonials', text: 'Отзывы' },
              { id: 'faq', text: 'FAQ' },
              { id: 'contact', text: 'Связь' },
            ]"
            :key="link.id"
            @click="scrollToSection(link.id)"
            class="px-2 py-2 rounded-lg text-slate-500 font-bold hover:text-emerald-500 transition-all text-[10px] uppercase tracking-tighter whitespace-nowrap"
          >
            {{ link.text }}
          </button>
        </div>

        <!-- Auth & Burger -->
        <div class="flex items-center gap-2 md:gap-3 shrink-0 relative z-[130]">
          <NuxtLink
            :to="isMounted && userStore.isAuthenticated ? '/dashboard' : '/login'"
            class="hidden sm:flex bg-slate-900 px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-white text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl whitespace-nowrap"
          >
            <template v-if="isMounted && userStore.isAuthenticated"> Кабинет </template>
            <template v-else> Войти </template>
          </NuxtLink>

          <!-- Professional Burger Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 transition-all active:scale-90 z-[140]"
            aria-label="Toggle Menu"
          >
            <div class="relative w-6 h-5 flex flex-col justify-between overflow-hidden">
              <span
                class="w-full h-0.5 bg-slate-900 rounded-full transition-all duration-500 origin-left"
                :class="mobileMenuOpen ? 'rotate-[42deg] translate-x-1' : ''"
              ></span>
              <span
                class="w-full h-0.5 bg-slate-900 rounded-full transition-all duration-500"
                :class="mobileMenuOpen ? 'translate-x-[150%] opacity-0' : ''"
              ></span>
              <span
                class="w-full h-0.5 bg-slate-900 rounded-full transition-all duration-500 origin-left"
                :class="mobileMenuOpen ? '-rotate-[42deg] translate-x-1' : ''"
              ></span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <!-- Premium Mobile Menu Overlay -->
    <Transition @enter="onEnter" @leave="onLeave" :css="false">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-[105] bg-white pointer-events-auto lg:hidden flex flex-col pt-24 overflow-hidden"
      >
        <!-- Background Decor -->
        <div class="absolute inset-0 pointer-events-none opacity-40">
          <div
            class="absolute top-[-10%] right-[-10%] w-[80%] h-[50%] bg-emerald-100 rounded-full blur-[140px] animate-pulse"
          ></div>
          <div
            class="absolute bottom-[-10%] left-[-10%] w-[80%] h-[50%] bg-blue-100 rounded-full blur-[140px] animate-pulse"
            style="animation-delay: 2s"
          ></div>
        </div>

        <!-- Scrollable Content Container -->
        <div class="relative z-10 flex flex-col h-full overflow-y-auto px-6 pb-12 scrollbar-none">
          <div class="max-w-lg mx-auto w-full pt-8 flex flex-col min-h-full">
            <!-- Header for Menu -->
            <div class="mb-8 menu-item opacity-0">
              <p class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">
                Навигация
              </p>
              <h3 class="text-3xl font-black text-slate-900 tracking-tight">Куда заглянем?</h3>
            </div>

            <!-- Links Grid -->
            <div class="grid grid-cols-1 gap-3 menu-items mb-12">
              <button
                v-for="link in [
                  { id: 'features', text: 'Преимущества', icon: '✨', desc: 'Почему мы лучшие' },
                  { id: 'process', text: 'Процесс', icon: '⚙️', desc: 'Как проходит обучение' },
                  { id: 'pricing', text: 'Тарифы', icon: '💎', desc: 'Выбери свой путь' },
                  { id: 'testimonials', text: 'Отзывы', icon: '🎭', desc: 'Что говорят студенты' },
                  { id: 'faq', text: 'FAQ', icon: '💬', desc: 'Ответы на вопросы' },
                  { id: 'contact', text: 'Контакты', icon: '✉️', desc: 'Напиши нам привет' },
                ]"
                :key="link.id"
                @click="handleMobileNav(link.id)"
                class="group flex items-center gap-5 p-4 bg-slate-50/80 hover:bg-emerald-50 rounded-[2rem] border border-slate-100 hover:border-emerald-200 transition-all menu-item opacity-0"
              >
                <span
                  class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-50 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500"
                >
                  {{ link.icon }}
                </span>
                <div class="text-left flex-grow">
                  <h4
                    class="text-base font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-600 transition-colors"
                  >
                    {{ link.text }}
                  </h4>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {{ link.desc }}
                  </p>
                </div>
                <div
                  class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                >
                  <span class="text-slate-400">→</span>
                </div>
              </button>
            </div>

            <!-- Auth & Footer -->
            <div class="mt-auto space-y-8 menu-footer opacity-0">
              <NuxtLink
                :to="isMounted && userStore.isAuthenticated ? '/dashboard' : '/login'"
                @click="mobileMenuOpen = false"
                class="w-full py-5 bg-slate-900 hover:bg-emerald-600 rounded-[2.5rem] flex items-center justify-center gap-4 text-white font-black text-base uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] active:scale-95 transition-all"
              >
                <span>
                  <template v-if="isMounted && userStore.isAuthenticated">
                    В личный кабинет
                  </template>
                  <template v-else> Начать обучение </template>
                </span>
                <span class="text-xl">🚀</span>
              </NuxtLink>

              <div class="flex flex-col items-center gap-6">
                <div class="flex gap-8">
                  <a
                    href="#"
                    class="text-xs font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                    >Telegram</a
                  >
                  <a
                    href="#"
                    class="text-xs font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                    >GitHub</a
                  >
                  <a
                    href="#"
                    class="text-xs font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                    >VK</a
                  >
                </div>
                <div
                  class="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100"
                >
                  <span class="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]"
                    >Handcrafted with</span
                  >
                  <span class="animate-pulse">🐍</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <main class="flex-grow">
      <slot />
    </main>

    <!-- Big Tech Premium Footer -->
    <footer
      class="relative bg-slate-950 text-slate-400 pt-24 pb-12 overflow-hidden border-t border-white/5"
    >
      <!-- Ambient Background Glows -->
      <div
        class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- Main Footer Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <!-- Brand Column -->
          <div class="lg:col-span-4 space-y-8">
            <div class="flex items-center gap-3 group cursor-pointer" @click="scrollToTop">
              <div
                class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-all duration-500"
              >
                <img :src="logoImage" alt="Logo" class="w-8 h-8 object-contain" />
              </div>
              <div class="flex flex-col">
                <span class="text-2xl font-black text-white tracking-tighter uppercase leading-none"
                  >Змейка</span
                >
              </div>
            </div>

            <p class="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
              Платформа, где ИИ помогает тебе стать
              <span class="text-white font-bold">разработчиком</span> быстрее, чем ты успеешь
              сказать «Hello World».
            </p>

            <!-- Social Ecosystem -->
            <div class="flex gap-4">
              <a
                v-for="social in [
                  { name: 'TG', icon: '✈️', href: '#' },
                  { name: 'GH', icon: '🐱', href: '#' },
                  { name: 'YT', icon: '📺', href: '#' },
                ]"
                :key="social.name"
                :href="social.href"
                class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 hover:bg-emerald-500 hover:border-emerald-400 hover:text-white hover:-translate-y-1 transition-all duration-300"
              >
                <span class="text-xl">{{ social.icon }}</span>
              </a>
            </div>
          </div>

          <!-- Links Columns -->
          <div class="lg:col-span-2 space-y-6">
            <h4 class="text-white font-black uppercase text-xs tracking-[0.2em]">Платформа</h4>
            <ul class="space-y-4">
              <li
                v-for="link in [
                  { id: 'features', text: 'Преимущества' },
                  { id: 'process', text: 'Процесс' },
                  { id: 'pricing', text: 'Тарифы' },
                ]"
                :key="link.id"
              >
                <button
                  @click="scrollToSection(link.id)"
                  class="hover:text-emerald-400 transition-colors duration-200 font-bold text-sm tracking-tight capitalize"
                >
                  {{ link.text }}
                </button>
              </li>
            </ul>
          </div>

          <div class="lg:col-span-2 space-y-6">
            <h4 class="text-white font-black uppercase text-xs tracking-[0.2em]">Помощь</h4>
            <ul class="space-y-4">
              <li
                v-for="link in [
                  { id: 'faq', text: 'FAQ' },
                  { id: 'contact', text: 'Поддержка' },
                  { id: 'status', text: 'Статус сетей' },
                ]"
                :key="link.id"
              >
                <button
                  @click="scrollToSection(link.id)"
                  class="hover:text-emerald-400 transition-colors duration-200 font-bold text-sm tracking-tight capitalize"
                >
                  {{ link.text }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Community / Join Card Column -->
          <div class="lg:col-span-4 space-y-6">
            <h4 class="text-white font-black uppercase text-xs tracking-[0.2em]">Будь в курсе</h4>
            <div
              class="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group"
            >
              <!-- Background Accent -->
              <div
                class="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700"
              ></div>

              <div class="relative space-y-6">
                <p class="text-sm font-bold text-slate-300 leading-relaxed">
                  Присоединяйся к <span class="text-white">10,000+</span> студентов и получай доступ
                  к закрытым урокам и ранним обновлениям.
                </p>

                <!-- Mini Avatars Social Proof -->
                <div class="flex items-center -space-x-3">
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden"
                  >
                    <img
                      :src="`https://i.pravatar.cc/100?img=${i + 10}`"
                      alt="Avatar"
                      class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div
                    class="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white"
                  >
                    +1k
                  </div>
                </div>

                <!-- Input Group -->
                <div class="space-y-3">
                  <div class="relative group/input">
                    <input
                      type="email"
                      placeholder="твой@email.com"
                      class="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                    <button
                      class="absolute right-2 top-2 bottom-2 px-4 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      GO
                    </button>
                  </div>
                </div>

                <p
                  class="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-loose"
                >
                  * Никакого спама. Только чистый код и апдейты раз в неделю.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600"
              >© 2026 ЗМЕЙКА.РУ</span
            >
            <div class="flex gap-6">
              <NuxtLink
                to="/privacy"
                class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >Политика конфиденциальности</NuxtLink
              >
              <NuxtLink
                to="/terms"
                class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >Условия использования</NuxtLink
              >
            </div>
          </div>

          <!-- Refined Developer Signature -->
          <div class="group relative">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
            ></div>
            <div
              class="relative px-6 py-3 bg-slate-950 rounded-2xl border border-white/10 flex items-center gap-4 leading-none"
            >
              <div class="flex flex-col text-right">
                <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1"
                  >Architected by</span
                >
                <span class="text-sm font-black text-white uppercase tracking-tight"
                  >ILAI NOVIER</span
                >
              </div>
              <div class="w-px h-8 bg-white/10"></div>
              <div class="relative flex items-center justify-center">
                <div class="relative flex items-center justify-center w-8 h-8">
                  <span class="absolute w-6 h-6 bg-red-500/30 rounded-full animate-ping"></span>
                  <span class="relative text-xl animate-pulse">❤️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted, watch } from 'vue'

import logoImage from '~/assets/logo.png'
import { useUserStore } from '~/entities/user/model/store'

const userStore = useUserStore()
const isMounted = ref(false)
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

// GSAP Transition Handlers
const onEnter = (el: Element, done: () => void) => {
  const menuItems = el.querySelectorAll('.menu-item')
  const footer = el.querySelector('.menu-footer')

  gsap.set(el, { opacity: 0 })
  gsap.set(menuItems, { x: 50, opacity: 0 })
  gsap.set(footer, { y: 20, opacity: 0 })

  const tl = gsap.timeline({
    onComplete: done,
  })

  tl.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    .to(
      menuItems,
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'expo.out',
      },
      '-=0.2',
    )
    .to(
      footer,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.3',
    )
}

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.inOut',
    onComplete: done,
  })
}

// Lock scroll when menu is open
watch(mobileMenuOpen, (val) => {
  if (process.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

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

const handleMobileNav = (id: string) => {
  mobileMenuOpen.value = false
  scrollToSection(id)
}

const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  isMounted.value = true
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
