<template>
  <section id="faq" class="py-20 md:py-40 px-4 md:px-6 bg-slate-50 relative overflow-hidden">
    <!-- Background textures -->
    <div
      class="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full"
    ></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <header class="text-center mb-16 md:mb-32 space-y-4 md:space-y-6 faq-header">
        <span
          class="inline-block px-3 md:px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]"
          >Knowledge Base</span
        >
        <h2
          class="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter"
        >
          Разбираемся <br class="hidden md:block" />
          <span class="text-slate-400">в деталях</span>
        </h2>
        <p class="text-slate-500 text-base md:text-xl font-medium max-w-xl mx-auto">
          Отвечаем на вопросы, которые чаще всего задают будущие инженеры.
        </p>
      </header>

      <div class="space-y-4 md:space-y-6 faq-list">
        <article
          v-for="(item, index) in faqItems"
          :key="index"
          class="faq-card bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 transition-shadow duration-500 relative group overflow-hidden"
          :class="activeFaq === index ? 'shadow-2xl' : 'hover:shadow-xl hover:-translate-y-1'"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full flex items-center justify-between p-5 md:p-10 text-left outline-none select-none group/btn"
          >
            <div class="flex items-center gap-3 md:gap-6">
              <span
                class="text-[10px] md:text-xs font-black text-slate-300 group-hover:text-emerald-500 transition-colors uppercase tracking-widest"
                >0{{ index + 1 }}</span
              >
              <span
                class="text-base md:text-xl lg:text-2xl font-black text-slate-900 leading-tight group-hover:translate-x-1 transition-transform duration-300"
                >{{ item.q }}</span
              >
            </div>
            <div
              class="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-500 group-hover:bg-slate-900 group-hover:border-slate-900 shrink-0"
              :class="{ 'bg-slate-900 border-slate-900 rotate-45': activeFaq === index }"
            >
              <span
                class="text-xl md:text-2xl font-light"
                :class="
                  activeFaq === index ? 'text-white' : 'text-slate-300 group-hover:text-white'
                "
                >+</span
              >
            </div>
          </button>

          <div
            :ref="
              (el) => {
                if (el) faqContentRefs[index] = el as HTMLElement
              }
            "
            class="faq-content overflow-hidden opacity-0 h-0"
          >
            <div
              class="px-5 md:px-10 pb-6 md:pb-10 pt-0 text-slate-500 font-medium text-sm md:text-lg lg:text-xl leading-relaxed"
            >
              <div class="w-full h-px bg-slate-50 mb-3 md:mb-6"></div>
              {{ item.a }}
              <div class="mt-4 md:mt-8 flex flex-wrap gap-2 md:gap-3">
                <div
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-3 md:px-4 py-1 md:py-1.5 bg-slate-50 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest"
                >
                  {{ tag }}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ref, onMounted } from 'vue'

const activeFaq = ref<number | null>(null)
const faqContentRefs = ref<HTMLElement[]>([])

const faqItems = [
  {
    q: 'Нужна ли математика?',
    a: 'Для старта в разработке достаточно базовой логики. Наша платформа обучает алгоритмическому мышлению через практику, а сложные математические концепции мы объясняем на пальцах и котиках.',
    tags: ['Learning', 'Basics'],
  },
  {
    q: 'Нужно ли что-то устанавливать?',
    a: 'Совсем нет! Весь процесс обучения проходит прямо в браузере. У нас встроен полноценный редактор кода с ИИ-проверкой, так что ты можешь начать учиться хоть с планшета.',
    tags: ['No Installation', 'Cloud'],
  },
  {
    q: 'Как работает ИИ-наставник?',
    a: 'Он анализирует твой код в реальном времени, видит типичные ошибки и дает подсказки, не раскрывая решения сразу. Это как если бы рядом сидел опытный разработчик.',
    tags: ['AI technology', 'Features'],
  },
  {
    q: 'Как долго длится обучение?',
    a: 'Программа гибкая. В среднем студенты проходят базовый курс за 2-3 месяца, уделяя учебе по 1 часу в день. Но ты можешь двигаться в своем темпе — доступ к материалам остается навсегда.',
    tags: ['Timing', 'Flexibility'],
  },
  {
    q: 'Будет ли помощь с работой?',
    a: 'Да! На тарифе PRO мы помогаем составить крутое портфолио на основе твоих проектов и проводим тестовые собеседования с ИИ, чтобы ты чувствовал себя уверенно перед реальным оффером.',
    tags: ['Career', 'Portfolio'],
  },
  {
    q: 'Даете ли вы сертификат?',
    a: 'Да, после прохождения основных модулей и защиты финального проекта ты получишь именной сертификат с подтвержденными навыками и ссылкой на твое портфолио.',
    tags: ['Career', 'Certify'],
  },
]

const toggleFaq = (index: number) => {
  const content = faqContentRefs.value[index]
  if (!content) return

  if (activeFaq.value === index) {
    gsap.to(content, { height: 0, opacity: 0, duration: 0.6, ease: 'power4.inOut' })
    activeFaq.value = null
  } else {
    if (activeFaq.value !== null) {
      gsap.to(faqContentRefs.value[activeFaq.value], {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      })
    }
    activeFaq.value = index
    gsap.to(content, { height: 'auto', opacity: 1, duration: 0.8, ease: 'expo.out' })
  }
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // Staggered Entrance
  gsap.from('.faq-header > *', {
    scrollTrigger: { trigger: '#faq', start: 'top 80%' },
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: 'expo.out',
  })

  gsap.from('.faq-card', {
    scrollTrigger: { trigger: '.faq-list', start: 'top 70%' },
    x: -50,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: 'power3.out',
  })

  // No footer animation needed

  // Floating Magnetic Effect on cards
  if (typeof window !== 'undefined' && window.innerWidth > 1024) {
    const cards = document.querySelectorAll('.faq-card')
    ;(cards as unknown as HTMLElement[]).forEach((card) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / 30
        const y = (e.clientY - rect.top - rect.height / 2) / 10
        gsap.to(card, { x, y, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' })
      })
    })
  }
})
</script>

<style scoped>
.shadow-premium {
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
}
.faq-card {
  will-change: transform, opacity;
}
</style>
