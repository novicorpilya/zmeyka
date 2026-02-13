<template>
  <section id="testimonials" class="py-24 md:py-40 bg-white relative overflow-hidden">
    <!-- Sophisticated Background Decor -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-slate-50 to-white"
      ></div>
      <div
        class="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] animate-pulse"
      ></div>
      <div
        class="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] animate-pulse"
        style="animation-delay: 2s"
      ></div>
    </div>

    <div class="relative z-10">
      <!-- Section Header -->
      <div class="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div class="space-y-4 max-w-2xl">
            <span
              class="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]"
            >
              community
            </span>
            <h2
              class="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]"
            >
              Что говорят <br />
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500"
                >наши студенты</span
              >
            </h2>
          </div>
          <div class="hidden md:block text-right">
            <p class="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
              Общий рейтинг
            </p>
            <div class="flex items-center gap-2">
              <div class="flex text-emerald-400 text-xl">
                <span v-for="i in 5" :key="i">★</span>
              </div>
              <span class="text-3xl font-black text-slate-900">4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Infinite Marquee Section -->
      <div class="space-y-8 md:space-y-12">
        <!-- Row 1: Left to Right -->
        <div class="marquee-wrapper overflow-hidden pb-4">
          <div ref="marquee1" class="flex gap-6 md:gap-8 whitespace-nowrap px-4">
            <div
              v-for="(item, index) in [...testimonials, ...testimonials]"
              :key="`row1-${index}`"
              class="testimonial-card flex-shrink-0 w-[300px] md:w-[450px] group"
            >
              <div
                class="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-emerald-500/30 hover:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.15)] transition-all duration-500 relative overflow-hidden h-full flex flex-col"
              >
                <!-- Abstract Glow -->
                <div
                  class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>

                <div class="relative z-10 space-y-6">
                  <!-- Rating & Verified -->
                  <div class="flex items-center justify-between">
                    <div class="flex text-emerald-500 text-sm">
                      <span v-for="i in 5" :key="i">★</span>
                    </div>
                    <span
                      class="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"
                    >
                      <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      Verified Student
                    </span>
                  </div>

                  <!-- Text -->
                  <p
                    class="text-slate-700 text-lg md:text-xl font-bold leading-snug whitespace-normal line-clamp-4 group-hover:text-slate-900 transition-colors"
                  >
                    "{{ item.text }}"
                  </p>

                  <!-- Author -->
                  <div class="flex items-center gap-4 pt-4">
                    <div
                      class="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-200"
                    >
                      <img :src="item.avatar" :alt="item.name" class="w-full h-full object-cover" />
                    </div>
                    <div class="text-left">
                      <h4 class="font-black text-slate-900 text-sm uppercase tracking-tight">
                        {{ item.name }}
                      </h4>
                      <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        {{ item.role }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Right to Left -->
        <div class="marquee-wrapper overflow-hidden">
          <div ref="marquee2" class="flex gap-6 md:gap-8 whitespace-nowrap px-4">
            <div
              v-for="(item, index) in [...testimonialsReversed, ...testimonialsReversed]"
              :key="`row2-${index}`"
              class="testimonial-card flex-shrink-0 w-[300px] md:w-[450px] group"
            >
              <div
                class="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 hover:shadow-[0_32px_64px_-16px_rgba(59,130,246,0.3)] transition-all duration-500 relative overflow-hidden h-full flex flex-col"
              >
                <!-- Abstract Glow -->
                <div
                  class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>

                <div class="relative z-10 space-y-6">
                  <!-- Rating & Verified -->
                  <div class="flex items-center justify-between">
                    <div class="flex text-blue-400 text-sm">
                      <span v-for="i in 5" :key="i">★</span>
                    </div>
                    <span
                      class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"
                    >
                      <span class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                      Verified Choice
                    </span>
                  </div>

                  <!-- Text -->
                  <p
                    class="text-slate-300 text-lg md:text-xl font-bold leading-snug whitespace-normal line-clamp-4 group-hover:text-white transition-colors"
                  >
                    "{{ item.text }}"
                  </p>

                  <!-- Author -->
                  <div class="flex items-center gap-4 pt-4 border-t border-white/5">
                    <div
                      class="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10"
                    >
                      <img :src="item.avatar" :alt="item.name" class="w-full h-full object-cover" />
                    </div>
                    <div class="text-left">
                      <h4 class="font-black text-white text-sm uppercase tracking-tight">
                        {{ item.name }}
                      </h4>
                      <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        {{ item.role }}
                      </p>
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
import { onMounted, ref } from 'vue'

const marquee1 = ref<HTMLElement | null>(null)
const marquee2 = ref<HTMLElement | null>(null)

const testimonials = [
  {
    name: 'Алексей Иванов',
    role: 'Студент 8 класса',
    text: 'Раньше программирование казалось чем-то невозможным. В "Змейке" я за месяц написал своего первого чат-бота для Telegram. ИИ-наставник реально помогает не бросать, когда что-то не получается.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey',
  },
  {
    name: 'Марина Сергеевна',
    role: 'Родитель',
    text: 'Искала сыну досуг с пользой. Платформа очень затянула его: вместо игр в телефоне он теперь соревнуется с ИИ в написании кода. Вижу прогресс каждую неделю!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marina',
  },
  {
    name: 'Игорь К.',
    role: 'Студент 10 класса',
    text: 'Самое крутое — это мгновенная проверка. Тебе не надо ждать учителя, ты сразу видишь ошибку и понимаешь, как её исправить. Прошел базовый Python и уже делаю свой сайт.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Igor',
  },
  {
    name: 'Ольга П.',
    role: 'Родитель',
    text: 'Очень понятный интерфейс и интересные задачи. Дочь в восторге от игровой формы. Для нас важно, что обучение проходит в безопасности и под контролем умной системы.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
  },
]

const testimonialsReversed = [...testimonials].reverse()

onMounted(() => {
  // Row 1
  if (marquee1.value) {
    const totalWidth = marquee1.value.scrollWidth / 2
    const tween1 = gsap
      .to(marquee1.value, {
        x: -totalWidth,
        duration: 30,
        ease: 'none',
        repeat: -1,
        paused: false,
      })
      .progress(0.5)

    // Pause on hover
    marquee1.value.addEventListener('mouseenter', () =>
      gsap.to(tween1, { timeScale: 0, duration: 0.5 }),
    )
    marquee1.value.addEventListener('mouseleave', () =>
      gsap.to(tween1, { timeScale: 1, duration: 0.5 }),
    )
  }

  // Row 2
  if (marquee2.value) {
    const totalWidth = marquee2.value.scrollWidth / 2
    gsap.set(marquee2.value, { x: -totalWidth })

    const tween2 = gsap
      .to(marquee2.value, {
        x: 0,
        duration: 35,
        ease: 'none',
        repeat: -1,
        paused: false,
      })
      .progress(0.5)

    // Pause on hover
    marquee2.value.addEventListener('mouseenter', () =>
      gsap.to(tween2, { timeScale: 0, duration: 0.5 }),
    )
    marquee2.value.addEventListener('mouseleave', () =>
      gsap.to(tween2, { timeScale: 1, duration: 0.5 }),
    )
  }
})
</script>

<style scoped>
.testimonial-card {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.testimonial-card:hover {
  z-index: 50;
  transform: scale(1.05) translateY(-5px);
}
</style>
