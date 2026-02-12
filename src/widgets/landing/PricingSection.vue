<template>
  <section id="pricing" class="py-20 md:py-40 px-4 md:px-6 bg-white relative overflow-hidden">
    <!-- Sophisticated grid background -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.4]"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <header class="text-center mb-16 md:mb-32 space-y-4 md:space-y-8 pricing-header">
        <div
          class="inline-block px-3 md:px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Investment
        </div>
        <h2
          class="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter"
        >
          Твой билет в <br class="hidden md:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600"
            >высшую лигу</span
          >
        </h2>
        <p class="text-slate-500 text-base md:text-xl font-medium max-w-xl mx-auto">
          Мы сделали цены доступными, чтобы ты мог сфокусироваться на главном — своём росте.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-stretch pricing-grid">
        <!-- Wrapper for entrance animation -->
        <div v-for="(plan, i) in plans" :key="i" class="pricing-card-wrapper">
          <article
            class="pricing-card h-full flex flex-col rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 border relative group overflow-hidden transition-colors duration-300"
            :class="[
              plan.active
                ? 'bg-slate-900 border-slate-900 shadow-2xl md:scale-105'
                : 'bg-white border-slate-100 hover:border-emerald-500/20 shadow-premium',
            ]"
          >
            <!-- Accent Light (Hover effect) -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            ></div>

            <div
              class="relative z-10 space-y-6 md:space-y-12 h-full flex flex-col pointer-events-none"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4
                    class="text-lg md:text-xl font-black uppercase tracking-tight"
                    :class="plan.active ? 'text-white' : 'text-slate-900'"
                  >
                    {{ plan.name }}
                  </h4>
                  <p
                    class="text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1"
                    :class="plan.active ? 'text-emerald-400' : 'text-slate-400'"
                  >
                    {{ plan.badge }}
                  </p>
                </div>
                <div
                  v-if="plan.active"
                  class="px-2 md:px-3 py-1 bg-emerald-500 text-white rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest"
                >
                  Hit
                </div>
              </div>

              <div
                class="flex items-baseline gap-1"
                :class="plan.active ? 'text-white' : 'text-slate-900'"
              >
                <span class="text-4xl md:text-7xl font-black tracking-tighter price-text">{{
                  plan.price
                }}</span>
                <span v-if="plan.price !== 'B2B'" class="text-base md:text-xl font-bold opacity-30"
                  >/мес</span
                >
              </div>

              <div class="w-full h-px" :class="plan.active ? 'bg-white/10' : 'bg-slate-100'"></div>

              <ul class="space-y-3 md:space-y-6 flex-grow">
                <li
                  v-for="item in plan.items"
                  :key="item"
                  class="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-medium"
                >
                  <div
                    class="w-4 h-4 md:w-5 md:h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0"
                  >
                    <span class="text-emerald-500 text-[10px] md:text-xs">✔</span>
                  </div>
                  <span :class="plan.active ? 'text-slate-400' : 'text-slate-500'">{{ item }}</span>
                </li>
              </ul>

              <div class="pt-6 md:pt-10 pointer-events-auto">
                <button
                  class="btn-magnetic w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-base md:text-lg group/btn overflow-hidden relative shadow-xl transition-all duration-300"
                  :class="[
                    plan.active
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
                  ]"
                >
                  <span class="relative z-10">{{ plan.cta }}</span>
                  <div
                    class="absolute inset-0 bg-slate-900/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"
                  ></div>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted } from 'vue'

const plans = [
  {
    name: 'Старт',
    badge: 'Hobby',
    price: '0₽',
    items: [
      '5 ИИ проверок в день',
      'Базовые курсы Python',
      'Доступ в сообщество',
      '1 активный проект',
    ],
    cta: 'Выбрать Free',
  },
  {
    name: 'PRO Змейка',
    badge: 'Professional',
    price: '990₽',
    items: [
      'Безлимит проверок ИИ',
      'Все текущие и будущие курсы',
      'Личный диплом и портфолио',
      'Приоритетный доступ к менторам',
    ],
    cta: 'Стать PRO',
    active: true,
  },
  {
    name: 'Academy',
    badge: 'Schools',
    price: 'B2B',
    items: [
      'Кабинет для группы',
      'Аналитика успеваемости',
      'Скидки от 10 человек',
      'API для интеграции',
    ],
    cta: 'Связаться',
  },
]

onMounted(() => {
  // Use a slight delay to ensure everything is rendered
  setTimeout(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Header Animation
    gsap.from('.pricing-header > *', {
      scrollTrigger: {
        trigger: '#pricing',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
    })

    // Cards entrance
    const wrappers = gsap.utils.toArray('.pricing-card-wrapper')
    if (wrappers.length > 0) {
      gsap.from(wrappers, {
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
      })
    }

    // Interactive effects
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      const cards = gsap.utils.toArray('.pricing-card') as HTMLElement[]

      cards.forEach((card, i) => {
        // Subtle float
        gsap.to(card, {
          y: -10,
          duration: 2 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        // Tilt logic
        const wrapper = card.closest('.pricing-card-wrapper') as HTMLElement | null
        if (wrapper) {
          wrapper.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const rotateX = (y - rect.height / 2) / 30
            const rotateY = (rect.width / 2 - x) / 30

            gsap.to(card, {
              rotateX,
              rotateY,
              scale: card.classList.contains('scale-105') ? 1.08 : 1.03,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          })

          wrapper.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              scale: card.classList.contains('scale-105') ? 1.05 : 1,
              duration: 0.8,
              ease: 'elastic.out(1, 0.4)',
              overwrite: 'auto',
            })
          })
        }
      })
    }

    // Ensure ScrollTrigger refreshes after initial layout
    ScrollTrigger.refresh()
  }, 100)
})
</script>

<style scoped>
.pricing-card {
  transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;
}
.shadow-premium {
  box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.05);
}
.pricing-card-wrapper {
  perspective: 2000px;
}
</style>
