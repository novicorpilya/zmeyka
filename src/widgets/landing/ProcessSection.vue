<template>
  <section
    ref="sectionRef"
    id="process"
    class="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24 md:py-32 lg:py-0 overflow-hidden relative"
  >
    <!-- Ambient Background -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]"
      ></div>
      <!-- Grid pattern -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"
      ></div>
    </div>

    <!-- Section Header -->
    <div class="lg:h-screen flex flex-col justify-center items-center relative z-20 px-6">
      <div class="text-center mb-16 md:mb-20 lg:mb-0 process-header max-w-4xl mx-auto">
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]"
            >Процесс обучения</span
          >
        </div>

        <h2
          class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6"
        >
          От новичка до<br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
          >
            профессионала
          </span>
        </h2>

        <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Четыре этапа, которые превратят тебя в крутого разработчика. Каждый шаг продуман до
          мелочей.
        </p>
      </div>

      <!-- Horizontal Scroll Container -->
      <div
        ref="horizontalRef"
        class="lg:flex lg:w-[400vw] h-full lg:absolute lg:top-0 lg:left-0 lg:flex-row items-center gap-0 lg:pl-[100vw]"
      >
        <!-- Step Cards -->
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="process-panel w-full lg:w-screen h-auto lg:h-screen flex items-center justify-center flex-shrink-0 px-6 py-16 lg:py-0"
        >
          <div class="max-w-7xl w-full">
            <!-- Card Container -->
            <div
              class="relative rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16 overflow-hidden"
              :class="step.cardBg"
            >
              <!-- Card Background Gradient -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent"
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              <!-- Glow Effect -->
              <div
                class="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-50"
                :class="step.glowColor"
              ></div>

              <div
                class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                <!-- Left: Step Info -->
                <div class="step-info order-2 lg:order-1 space-y-8">
                  <!-- Step Number -->
                  <div class="flex items-center gap-4">
                    <span
                      class="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none opacity-20"
                      :class="step.numberColor"
                    >
                      {{ String(i + 1).padStart(2, '0') }}
                    </span>
                  </div>

                  <!-- Title -->
                  <div class="space-y-4">
                    <h3
                      class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight"
                    >
                      {{ step.title }}
                    </h3>
                    <p class="text-lg md:text-xl text-white/70 leading-relaxed max-w-lg">
                      {{ step.desc }}
                    </p>
                  </div>

                  <!-- Features List -->
                  <ul class="space-y-4 pt-4">
                    <li
                      v-for="(feature, fi) in step.features"
                      :key="fi"
                      class="flex items-center gap-4"
                    >
                      <div
                        class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"
                      >
                        <ClientOnly>
                          <component
                            :is="feature.icon"
                            class="w-5 h-5 text-white"
                            :stroke-width="2"
                          />
                        </ClientOnly>
                      </div>
                      <span class="text-white/80 font-medium">{{ feature.text }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Right: Visual -->
                <div class="step-visual order-1 lg:order-2 flex items-center justify-center">
                  <div class="relative">
                    <!-- Floating Icon Container -->
                    <div
                      class="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-[3rem] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl"
                    >
                      <ClientOnly>
                        <component
                          :is="step.iconComponent"
                          class="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 text-white drop-shadow-2xl animate-float"
                          :stroke-width="1"
                        />
                        <template #fallback>
                          <div
                            class="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-white/10 rounded-full animate-pulse"
                          ></div>
                        </template>
                      </ClientOnly>
                    </div>

                    <!-- Decorative Elements -->
                    <div
                      class="absolute -top-6 -right-6 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 animate-float-slow"
                    >
                      <ClientOnly>
                        <component
                          :is="step.badge1Icon"
                          class="w-8 h-8 md:w-10 md:h-10 text-white"
                          :stroke-width="1.5"
                        />
                      </ClientOnly>
                    </div>

                    <div
                      class="absolute -bottom-4 -left-4 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 animate-float-slow"
                      style="animation-delay: -2s"
                    >
                      <ClientOnly>
                        <component
                          :is="step.badge2Icon"
                          class="w-6 h-6 md:w-8 md:h-8 text-white"
                          :stroke-width="1.5"
                        />
                      </ClientOnly>
                    </div>

                    <!-- Progress Ring -->
                    <div class="absolute -bottom-8 -right-8 w-20 h-20 md:w-24 md:h-24">
                      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          stroke-width="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#progressGradient)"
                          stroke-width="8"
                          stroke-linecap="round"
                          :stroke-dasharray="`${(i + 1) * 70} 283`"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#10b981" />
                            <stop offset="100%" stop-color="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span
                        class="absolute inset-0 flex items-center justify-center text-white font-black text-lg md:text-xl"
                      >
                        {{ (i + 1) * 25 }}%
                      </span>
                    </div>
                  </div>
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
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Rocket,
  Code2,
  TrendingUp,
  Crown,
  Zap,
  Terminal,
  Layers,
  Award,
  UserPlus,
  Brain,
  Gamepad2,
  Play,
  Bug,
  MessageSquare,
  GitBranch,
  Puzzle,
  Target,
  Briefcase,
  Users,
} from 'lucide-vue-next'
import { ref, onMounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const horizontalRef = ref<HTMLElement | null>(null)

const steps = [
  {
    iconComponent: Rocket,
    badge1Icon: Zap,
    badge2Icon: UserPlus,
    title: 'Быстрый старт',
    desc: 'Настраиваем твой учебный план на основе целей: от создания простых скриптов до полноценной разработки приложений.',
    features: [
      { icon: UserPlus, text: 'Индивидуальный план обучения' },
      { icon: Brain, text: 'Адаптация под твой уровень' },
      { icon: Gamepad2, text: 'Постановка четких KPI' },
    ],
    cardBg: 'bg-gradient-to-br from-amber-600/90 via-orange-600/80 to-red-600/70',
    glowColor: 'bg-amber-500',
    numberColor: 'text-white',
  },
  {
    iconComponent: Code2,
    badge1Icon: Terminal,
    badge2Icon: Play,
    title: 'Интерактив',
    desc: 'Никаких скучных лекций. Ты сразу начинаешь писать код в нашем редакторе с мгновенной проверкой каждого шага.',
    features: [
      { icon: Play, text: '90% практики на реальном коде' },
      { icon: Bug, text: 'ИИ-помощник в исправлении ошибок' },
      { icon: MessageSquare, text: 'Поддержка менторов 24/7' },
    ],
    cardBg: 'bg-gradient-to-br from-violet-600/90 via-purple-600/80 to-fuchsia-600/70',
    glowColor: 'bg-violet-500',
    numberColor: 'text-white',
  },
  {
    iconComponent: TrendingUp,
    badge1Icon: Layers,
    badge2Icon: GitBranch,
    title: 'Сложные задачи',
    desc: 'Переходим к созданию архитектуры. Учимся писать чистый, масштабируемый и профессиональный код.',
    features: [
      { icon: GitBranch, text: 'Работа с реальным бэкендом' },
      { icon: Puzzle, text: 'Изучение паттернов проектирования' },
      { icon: Target, text: 'Анализ сложности алгоритмов' },
    ],
    cardBg: 'bg-gradient-to-br from-emerald-600/90 via-teal-600/80 to-cyan-600/70',
    glowColor: 'bg-emerald-500',
    numberColor: 'text-white',
  },
  {
    iconComponent: Crown,
    badge1Icon: Award,
    badge2Icon: Briefcase,
    title: 'Финал и Карьера',
    desc: 'Защита дипломного проекта, создание сильного портфолио и подготовка к первым собеседованиям в IT.',
    features: [
      { icon: Briefcase, text: 'Подготовка кейсов для резюме' },
      { icon: Award, text: 'Официальный сертификат' },
      { icon: Users, text: 'Рекомендации в компании-партнеры' },
    ],
    cardBg: 'bg-gradient-to-br from-blue-600/90 via-indigo-600/80 to-purple-600/70',
    glowColor: 'bg-blue-500',
    numberColor: 'text-white',
  },
]

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  let mm = gsap.matchMedia()

  mm.add('(min-width: 1024px)', () => {
    if (!horizontalRef.value || !sectionRef.value) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => (horizontalRef.value ? '+=' + horizontalRef.value.scrollWidth : '+=100%'),
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })

    // Fade out header
    tl.to('.process-header', { opacity: 0, y: -80, duration: 0.3 }, 0)

    // Horizontal scroll
    tl.to(
      horizontalRef.value,
      {
        x: () => (horizontalRef.value ? -(horizontalRef.value.scrollWidth - window.innerWidth) : 0),
        ease: 'none',
        duration: 5,
      },
      0.1,
    )

    // Panel animations
    const panels = gsap.utils.toArray('.process-panel') as HTMLElement[]
    panels.forEach((panel, i) => {
      const visual = panel.querySelector('.step-visual')
      const info = panel.querySelector('.step-info')
      const start = 0.1 + i * 1.2

      tl.from(visual, { scale: 0.85, opacity: 0, duration: 0.6, ease: 'power2.out' }, start)
      tl.from(info, { x: 60, opacity: 0, duration: 0.6, ease: 'power2.out' }, start + 0.1)
    })
  })

  mm.add('(max-width: 1023px)', () => {
    ;(gsap.utils.toArray('.process-panel') as HTMLElement[]).forEach((panel) => {
      gsap.from(panel, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    })
  })
})
</script>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-float-slow {
  animation: float 8s ease-in-out infinite;
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
</style>
