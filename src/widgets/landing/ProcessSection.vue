<template>
  <section
    ref="sectionRef"
    id="process"
    class="bg-slate-900 py-32 md:py-0 overflow-hidden relative"
  >
    <!-- Background dynamic elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"
      ></div>
    </div>

    <!-- Pinned Title Control -->
    <div class="md:h-screen flex flex-col justify-center items-center relative z-20 px-6">
      <div class="text-center mb-20 md:mb-0 process-header">
        <span
          class="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6"
          >Workflow</span
        >
        <h2 class="text-5xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter">
          Твоя
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500"
            >эволюция</span
          >
        </h2>
        <p class="text-slate-400 mt-8 text-xl font-medium max-w-sm mx-auto opacity-60">
          Скроль вниз, чтобы увидеть магию превращения
        </p>
      </div>

      <!-- Horizontal Wrapper -->
      <div
        ref="horizontalRef"
        class="md:flex md:w-[400vw] h-full md:absolute md:top-0 md:left-0 md:flex-row items-center gap-0 md:pl-[100vw]"
      >
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="process-panel w-full md:w-screen h-auto md:h-screen flex items-center justify-center flex-shrink-0 px-6 py-20 md:py-0"
        >
          <div
            class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
          >
            <!-- Visual Side -->
            <div class="step-visual relative aspect-square group">
              <div
                class="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-[4rem] group-hover:scale-105 transition-transform duration-700 blur-2xl opacity-50"
              ></div>
              <div
                class="relative h-full glass-card rounded-[4rem] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl"
              >
                <span
                  class="text-[120px] md:text-[240px] drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-float select-none"
                  >{{ step.icon }}</span
                >
                <div
                  class="absolute top-10 left-10 text-white/5 font-black text-[120px] md:text-[200px] leading-none"
                >
                  {{ i + 1 }}
                </div>
              </div>
            </div>

            <!-- Info Side -->
            <div class="step-info space-y-8 text-center md:text-left">
              <div
                class="inline-flex items-center gap-4 text-emerald-400 font-black text-xs uppercase tracking-[0.3em]"
              >
                <span class="w-12 h-px bg-emerald-500/30"></span>
                Phase 0{{ i + 1 }}
              </div>
              <h3 class="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight">
                {{ step.title }}
              </h3>
              <p class="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed">
                {{ step.desc }}
              </p>
              <div class="pt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                <span
                  v-for="tag in step.tags"
                  :key="tag"
                  class="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase text-slate-300"
                  >{{ tag }}</span
                >
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

const sectionRef = ref<HTMLElement | null>(null)
const horizontalRef = ref<HTMLElement | null>(null)

const steps = [
  {
    icon: '🥚',
    title: 'Пробуждение',
    desc: 'Мы создаем твой цифровой профиль и подбираем персональную нейросеть-наставника под твои интересы.',
    tags: ['Setup', 'AI Profiling', 'Character'],
  },
  {
    icon: '🧪',
    title: 'Эксперименты',
    desc: 'Погружение в живой код без воды. Каждая строчка кода, написанная тобой, тут же анализируется системой.',
    tags: ['Live Coding', 'Active Learning'],
  },
  {
    icon: '🐍',
    title: 'Мутация',
    desc: 'Твой код становится чище, а решения — эффективнее. Формируем архитектурное мышление с первого дня.',
    tags: ['Optimization', 'Refactoring'],
  },
  {
    icon: '🐉',
    title: 'Вознесение',
    desc: 'Финальный проект готов к портфолио. Ты получаешь диплом и пожизненный доступ к нашему закрытому IT-клубу.',
    tags: ['Portfolio', 'Certification', 'Network'],
  },
]

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  let mm = gsap.matchMedia()

  mm.add('(min-width: 768px)', () => {
    if (!horizontalRef.value || !sectionRef.value) return

    // Single Timeline for better stability
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => '+=' + horizontalRef.value!.scrollWidth,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })

    // 1. Fade out header
    tl.to('.process-header', { opacity: 0, y: -50, duration: 0.5 }, 0)

    // 2. Horizontal move
    tl.to(
      horizontalRef.value,
      {
        x: () => -(horizontalRef.value!.scrollWidth - window.innerWidth),
        ease: 'none',
        duration: 5, // Large duration to allow internal animations to time correctly
      },
      0.2,
    )

    // 3. Subtle panel internal animations
    const panels = gsap.utils.toArray('.process-panel') as HTMLElement[]
    panels.forEach((panel, i) => {
      const visual = panel.querySelector('.step-visual')
      const info = panel.querySelector('.step-info')

      // Use a small part of the main timeline for each panel
      const start = 0.2 + i * 1.2
      tl.from(visual, { scale: 0.8, opacity: 0.3, duration: 0.5 }, start)
      tl.from(info, { x: 50, opacity: 0, duration: 0.5 }, start + 0.1)
    })
  })

  mm.add('(max-width: 767px)', () => {
    ;(gsap.utils.toArray('.process-panel') as HTMLElement[]).forEach((panel) => {
      gsap.from(panel, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        overwrite: 'auto',
      })
    })
  })
})
</script>

<style scoped>
.glass-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(40px);
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
