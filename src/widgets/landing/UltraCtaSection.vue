<template>
  <section
    class="pt-20 pb-10 md:pt-40 md:pb-20 lg:pt-60 lg:pb-20 px-4 md:px-6 relative overflow-hidden bg-white"
  >
    <!-- Big ambient glow background -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 blur-[160px]"
      ></div>
    </div>

    <div class="max-w-6xl mx-auto relative group cta-container">
      <!-- Outer glow -->
      <div
        class="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2rem] md:rounded-[4rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"
      ></div>

      <div
        class="relative bg-slate-900 rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 lg:p-32 overflow-hidden border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
      >
        <!-- Animated Elements -->
        <div class="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div
            class="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-500 rounded-full filter blur-[120px] animate-pulse"
          ></div>
          <div
            class="absolute bottom-[-20%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600 rounded-full filter blur-[120px] animate-pulse"
            style="animation-delay: 2s"
          ></div>
        </div>

        <!-- Grid overlay -->
        <div
          class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"
        ></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
          <div class="space-y-6 md:space-y-12 text-center lg:text-left cta-content">
            <span
              class="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]"
              >Final Step</span
            >

            <h2
              class="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter"
            >
              Хватит <br class="hidden md:block" />
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400"
                >просто ждать</span
              >
            </h2>

            <p
              class="text-slate-400 text-base md:text-xl lg:text-2xl font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Твоя карьера в IT начинается не с универа, а с первой написанной строчки кода. Сделай
              это сейчас.
            </p>

            <div
              class="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center lg:justify-start pt-4 md:pt-6"
            >
              <NuxtLink
                :to="userStore.isAuthenticated ? '/dashboard' : '/register'"
                class="btn-magnetic group/btn relative scale-up"
              >
                <span
                  class="block px-8 md:px-12 py-4 md:py-6 bg-emerald-500 rounded-xl md:rounded-2xl font-black text-white text-lg md:text-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 text-center shimmer-button"
                >
                  <ClientOnly>
                    {{ userStore.isAuthenticated ? 'Вернуться в кабинет' : 'Ворваться в IT' }}
                    <template #fallback>Ворваться в IT</template>
                  </ClientOnly>
                </span>
              </NuxtLink>
              <button
                class="px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-slate-400 text-base md:text-xl hover:text-white transition-all"
              >
                Чат поддержки
              </button>
            </div>
          </div>

          <!-- Visual Side -->
          <div class="relative flex justify-center lg:justify-end cta-visual">
            <div class="relative w-full max-w-xs md:max-w-md aspect-square">
              <!-- Glow behind mascot -->
              <div
                class="absolute inset-0 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse"
              ></div>
              <img
                :src="programmSnakeImage"
                alt="Mascot"
                class="w-full h-full object-contain filter brightness-110 drop-shadow-[0_40px_60px_rgba(16,185,129,0.4)] animate-float"
              />

              <!-- Flying bits (hidden on small screens) -->
              <div
                class="absolute -top-10 right-0 glass px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-2xl animate-float-slow hidden sm:block"
                style="animation-delay: -1s"
              >
                <span class="text-emerald-400 font-mono text-xs md:text-sm"
                  >&lt;HelloWorld /&gt;</span
                >
              </div>
              <div
                class="absolute bottom-10 -left-10 glass px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-2xl animate-float-slow hidden sm:block"
                style="animation-delay: -3s"
              >
                <span class="text-blue-400 font-mono text-xs md:text-sm">npm install success</span>
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
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ref, onMounted } from 'vue'

import programmSnakeImage from '~/assets/programmSnake.png'
import { useUserStore } from '~/entities/user/model/store'

const userStore = useUserStore()
const isMounted = ref(false)

interface Props {
  startRoute: string
}
defineProps<Props>()

onMounted(() => {
  isMounted.value = true
  gsap.registerPlugin(ScrollTrigger)

  // Entrance Animation
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.cta-container',
      start: 'top 70%',
    },
  })

  tl.from('.cta-content > *', {
    y: 60,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'expo.out',
  })

  tl.from(
    '.cta-visual',
    {
      scale: 0.8,
      opacity: 0,
      x: 100,
      duration: 1.5,
      ease: 'expo.out',
    },
    '-=1',
  )
})
</script>

<style scoped>
.animate-float {
  animation: float 8s ease-in-out infinite;
}
.animate-float-slow {
  animation: float 12s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-30px) rotate(2deg);
  }
}
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(224, 242, 254, 0.1);
}
</style>
