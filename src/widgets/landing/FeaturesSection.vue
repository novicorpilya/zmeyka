<template>
  <section id="features" class="py-40 px-6 relative bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto relative z-10">
      <header class="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div class="max-w-2xl reveal-text">
          <span
            class="inline-block px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
            >Capabilities</span
          >
          <h2 class="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
            Инструменты <br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600"
              >нового поколения</span
            >
          </h2>
        </div>
        <p class="text-slate-500 font-medium text-lg max-w-xs md:text-right">
          Мы объединили вычислительную мощь ИИ и психологию обучения.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
        <!-- 3D Card 1: AI Engine (Big) -->
        <div class="feature-card-wrapper md:col-span-8 md:row-span-2">
          <div
            class="feature-card group h-full bg-slate-50 rounded-[3rem] p-12 border border-slate-100 flex flex-col justify-between overflow-hidden relative"
          >
            <div
              class="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            ></div>

            <div class="relative z-10">
              <div
                class="w-16 h-16 bg-white rounded-2xl shadow-premium border border-slate-100 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
              >
                🧠
              </div>
              <h3 class="text-3xl font-black text-slate-900 mb-4">Нейросетевой разбор кода</h3>
              <p class="text-slate-500 font-medium text-lg max-w-sm">
                Наша модель обучалась на миллионах строк кода, чтобы находить не только
                синтаксические ошибки, но и проблемы в логике и архитектуре.
              </p>
            </div>

            <!-- Animated code snippet -->
            <div
              class="absolute bottom-[-10%] right-[-5%] w-[60%] glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl rotate-[-5deg] group-hover:rotate-0 group-hover:translate-y-[-20px] transition-all duration-700"
            >
              <div class="flex gap-2 mb-4">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div class="font-mono text-xs text-white/70 space-y-1">
                <div class="flex gap-4">
                  <span class="text-emerald-400">def</span>
                  <span class="text-blue-400">optimize_snake</span>():
                </div>
                <div class="pl-4 text-emerald-400/50"># Analyzing complexity...</div>
                <div class="pl-4">
                  <span class="text-purple-400">return</span>
                  <span class="text-yellow-400">"Success"</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3D Card 2: Gamification -->
        <div class="feature-card-wrapper md:col-span-4 md:row-span-1">
          <div
            class="feature-card group h-full bg-slate-900 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-between overflow-hidden relative"
          >
            <div class="relative z-10">
              <div
                class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-6"
              >
                🎮
              </div>
              <h4 class="text-xl font-black text-white">RPG Система</h4>
              <p class="text-slate-400 text-sm mt-2">Прокачивай навыки как в любимой игре.</p>
            </div>
            <div class="h-1 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 w-[65%] animate-shimmer"></div>
            </div>
          </div>
        </div>

        <!-- 3D Card 3: Mobile -->
        <div class="feature-card-wrapper md:col-span-4 md:row-span-1">
          <div
            class="feature-card group h-full bg-emerald-500 rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden relative"
          >
            <div class="relative z-10 text-white">
              <div class="text-4xl mb-6 group-hover:rotate-12 transition-transform">📱</div>
              <h4 class="text-xl font-black">Всегда с собой</h4>
              <p class="text-white/80 text-sm mt-2">Обучение адаптировано под любой экран.</p>
            </div>
            <div
              class="absolute -right-4 -bottom-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"
            ></div>
          </div>
        </div>

        <!-- 3D Card 4: Community (Wide) -->
        <div class="feature-card-wrapper md:col-span-12 md:row-span-1">
          <div
            class="feature-card group h-full bg-white border-4 border-slate-50 rounded-[3rem] p-10 flex items-center justify-between overflow-hidden relative px-12"
          >
            <div class="space-y-4">
              <h3 class="text-2xl font-black text-slate-900">Комьюнити единомышленников</h3>
              <p class="text-slate-500 font-medium max-w-md">
                Ты никогда не останешься один. Тысячи студентов помогают друг другу в закрытом
                Discord.
              </p>
            </div>
            <div class="hidden md:flex -space-x-4">
              <div
                v-for="i in 6"
                :key="i"
                class="w-16 h-16 rounded-full border-4 border-white bg-slate-100 shadow-premium group-hover:translate-x-2 transition-transform"
                :style="`transition-delay: ${i * 50}ms`"
              >
                <img
                  :src="`https://i.pravatar.cc/100?u=${i + 20}`"
                  class="w-full h-full object-cover"
                />
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
import { onMounted } from 'vue'

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // Header animation with text reveal
  gsap.from('.reveal-text h2', {
    scrollTrigger: {
      trigger: '#features',
      start: 'top 80%',
    },
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: 'expo.out',
  })

  // Cards cascade entrance
  const cards = gsap.utils.toArray('.feature-card')
  ;(cards as unknown as HTMLElement[]).forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
      },
      y: 60,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      delay: i * 0.1,
      ease: 'back.out(1.4)',
    })

    // 3D Tilt Effect on mousemove
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto',
        })
      })
    }
  })
})
</script>

<style scoped>
.feature-card {
  transform-style: preserve-3d;
  will-change: transform;
  /* Removed transition: transform to avoid conflict with GSAP */
}
.glass-dark {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
}
.shadow-premium {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
