<template>
  <section
    class="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden bg-white"
  >
    <!-- Sophisticated Background -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- Noise Texture for "Designed" feel -->
      <div
        class="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
      ></div>

      <div
        class="absolute -top-[10%] -left-[5%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"
      ></div>
      <div
        class="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse"
        style="animation-delay: 2s"
      ></div>
      <!-- Grid pattern -->
      <div
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"
      ></div>
    </div>

    <div
      class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start relative z-10"
    >
      <div class="space-y-8 md:space-y-12 text-center lg:text-left lg:pt-8">
        <div
          class="hero-badge inline-flex items-center gap-3 px-4 md:px-5 py-2 whitespace-nowrap bg-emerald-50/80 backdrop-blur-md rounded-full border border-emerald-100 shadow-sm transition-all hover:border-emerald-200 cursor-default opacity-0 -translate-y-4 mx-auto lg:mx-0 font-display"
        >
          <span class="flex h-2 w-2 relative">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span
            class="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]"
            >Для школьников 10–16 лет</span
          >
        </div>

        <h1
          class="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-[0.95] tracking-tight perspective-1000"
          aria-label="Научим ребенка программировать на Python с ИИ-наставником"
        >
          <span class="hero-word block overflow-hidden">
            <span class="inline-block opacity-0 translate-y-full">Научим</span>
          </span>
          <span class="hero-word block overflow-hidden">
            <span
              class="inline-block opacity-0 translate-y-full text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600 drop-shadow-sm"
              >кодить</span
            >
          </span>
          <span class="hero-word block overflow-hidden">
            <span class="inline-block opacity-0 translate-y-full">вашего ребенка</span>
          </span>
        </h1>

        <p
          class="hero-description text-base md:text-xl lg:text-2xl 2xl:text-3xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-0 translate-y-8"
        >
          Онлайн-платформа, где школьники осваивают Python через
          <span class="text-slate-900 font-black border-b-4 border-emerald-500/20"
            >реальные задачи</span
          >
          с поддержкой ИИ-наставника и элементами RPG-игры.
        </p>

        <div
          class="hero-cta flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8 pt-4 opacity-0 translate-y-8"
        >
          <NuxtLink
            to="/register"
            class="btn-magnetic w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-emerald-500 rounded-xl md:rounded-2xl font-black text-white text-lg md:text-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 text-center shimmer-button"
          >
            Начать бесплатно
          </NuxtLink>

          <div class="flex flex-col items-center lg:items-start">
            <div class="flex -space-x-3 mb-2">
              <div
                v-for="i in 3"
                :key="i"
                class="w-8 h-8 rounded-full border-2 border-white bg-slate-100"
              >
                <img
                  :src="`https://i.pravatar.cc/100?u=${i + 10}`"
                  class="w-full h-full object-cover rounded-full"
                />
              </div>
              <div
                class="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white"
              >
                +1k
              </div>
            </div>
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Уже учатся с нами
            </p>
          </div>
        </div>
      </div>

      <!-- Hero Visual -->
      <div class="hero-visual relative opacity-0 translate-x-12">
        <div
          class="absolute -inset-10 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-full blur-[80px] animate-pulse"
        ></div>
        <div class="relative w-full aspect-square max-w-lg mx-auto">
          <!-- Floating mascot -->
          <img
            :src="beginnerSnakeImage"
            alt="Mascot"
            class="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-float p-12"
          />

          <!-- Dynamic UI snippets -->
          <div
            class="absolute top-10 -right-10 glass p-4 rounded-2xl shadow-premium border border-white animate-float-slow"
            style="animation-delay: -1s"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black"
              >
                JS
              </div>
              <div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Compiler
                </div>
                <div class="text-xs font-black text-slate-800">Hello, World!</div>
              </div>
            </div>
          </div>

          <div
            class="absolute bottom-20 -left-10 glass p-5 rounded-3xl shadow-premium border border-white animate-float-slow"
            style="animation-delay: -2s"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl"
              >
                ✨
              </div>
              <div>
                <div class="text-xs font-black text-slate-800">+150 XP</div>
                <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Level Up!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted } from 'vue'

import beginnerSnakeImage from '@shared/assets/beginnerSnake.png'
import { useUserStore } from '@entities/user/model/store'

// const userStore = useUserStore()
const isMounted = ref(false)
let heroMouseMove: ((e: MouseEvent) => void) | null = null

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

onMounted(() => {
  isMounted.value = true
  // Ultra-fast timeline for snappier feel
  const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.8 } })

  tl.to('.hero-badge', { y: 0, opacity: 1, duration: 0.6 }, 0.1)
  tl.to('.hero-word span', { y: 0, opacity: 1, stagger: 0.1 }, 0.2)
  tl.to('.hero-visual', { x: 0, opacity: 1, duration: 1.2 }, 0.3)
  tl.to('.hero-description', { y: 0, opacity: 1 }, 0.5)
  tl.to('.hero-cta', { y: 0, opacity: 1 }, 0.6)

  if (!isTouchDevice()) {
    const words = document.querySelectorAll('.hero-word span')
    heroMouseMove = (e: MouseEvent) => {
      words.forEach((word) => {
        const rect = word.getBoundingClientRect()
        const dx = e.clientX - (rect.left + rect.width / 2)
        const dy = e.clientY - (rect.top + rect.height / 2)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 400) {
          const power = (400 - dist) / 400
          gsap.to(word, {
            x: dx * power * 0.1,
            y: dy * power * 0.1,
            duration: 0.6,
            overwrite: 'auto',
          })
        } else {
          gsap.to(word, { x: 0, y: 0, duration: 0.8, overwrite: 'auto' })
        }
      })
    }
    window.addEventListener('mousemove', heroMouseMove)
  }
})

onUnmounted(() => {
  if (heroMouseMove) window.removeEventListener('mousemove', heroMouseMove)
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.hero-word span {
  display: inline-block;
  will-change: transform, opacity;
}
.animate-float-slow {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
.shadow-premium {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
}
.glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}
</style>
