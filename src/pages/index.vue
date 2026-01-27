<template>
  <main id="main-content" class="w-full cursor-none-container selection:bg-brand-green/30">
    <!-- Skip to content for Accessibility -->
    <a href="#features" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[10000] bg-brand-green text-white px-6 py-3 rounded-xl font-bold">Перейти к контенту</a>

    <!-- Custom Snake-Sense Cursor -->
    <div class="snake-cursor pointer-events-none fixed inset-0 z-[9999] hidden lg:block" aria-hidden="true">
        <div v-for="i in 10" :key="i" class="cursor-dot absolute w-2 h-2 bg-brand-green/40 rounded-full blur-[2px]"></div>
        <div class="cursor-main absolute w-6 h-6 border-2 border-brand-green rounded-full shadow-[0_0_20px_#22c55e] flex items-center justify-center mix-blend-difference">
            <div class="w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_10px_#22c55e]"></div>
        </div>
    </div>

    <!-- Hero Section -->
    <section ref="heroRef" class="relative pt-32 pb-40 px-6 overflow-hidden" @mousemove="handleHeroParallax">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl animate-blob"></div>
        <div class="absolute top-40 right-10 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-width-wrapper max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Text Content -->
        <article class="space-y-10 relative z-10">
          <div class="hero-badge inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-green/20 text-brand-green font-black rounded-full text-sm uppercase tracking-widest shadow-sm hover:shadow-md transition-all cursor-default">
            <span class="animate-pulse text-lg" aria-hidden="true">✨</span> Твой новый путь в мир IT
          </div>
          
          <h1 class="hero-title text-4xl sm:text-6xl md:text-8xl font-black text-slate-800 leading-[0.9] tracking-tight drop-shadow-2xl">
            <div class="hero-word-line overflow-hidden py-2">
                <span class="hero-word inline-block mr-4">Учись</span> 
                <span class="hero-word inline-block text-brand-green highlight-glow">кодить</span>
            </div>
            <div class="hero-word-line overflow-hidden py-2">
                <span class="hero-word inline-block mr-4">играя</span> 
                <span class="hero-word inline-block text-brand-yellow highlight-glow relative">
                    вместе
                    <svg class="absolute -bottom-2 left-0 w-full h-4 text-brand-yellow/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" />
                    </svg>
                </span>
            </div>
          </h1>

          <p class="hero-description text-xl font-bold text-slate-500 max-w-lg leading-relaxed">
            Погрузись в обучение с самым добрым в мире AI-помощником. Сдавай домашки и получай мгновенный разбор от нашей Змейки!
          </p>
          
          <div class="hero-cta flex flex-wrap gap-5 pt-4">
            <NuxtLink to="/dashboard" aria-label="Начать бесплатное обучение" class="btn-magnetic bg-brand-green px-10 py-5 rounded-3xl font-black text-white text-xl shadow-[0_8px_0_0_#166534] hover:shadow-[0_4px_0_0_#166534] transition-all btn-bouncy flex items-center gap-3 text-decoration-none focus:ring-4 focus:ring-brand-green/30 outline-none">
              <span aria-hidden="true">🚀</span> Начать бесплатно
            </NuxtLink>
            <button aria-label="Смотреть демо урок" class="btn-magnetic bg-white px-10 py-5 rounded-3xl font-black text-slate-600 text-xl border-4 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-3 shadow-sm focus:ring-4 focus:ring-slate-100 outline-none">
              <span aria-hidden="true">▶️</span> Демо урок
            </button>
          </div>
        </article>

        <!-- Hero Snake -->
        <div class="hero-image relative lg:h-[700px] flex items-center justify-center">
          <div class="relative w-full max-w-lg aspect-square">
            <div class="hero-bg-blob absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-blue/20 rounded-[4rem] transform rotate-6" aria-hidden="true"></div>
            <div class="hero-card absolute inset-0 bg-white rounded-[4rem] border-8 border-white shadow-cartoon-lg flex items-center justify-center overflow-hidden transform -rotate-3 transition-transform hover:rotate-0 duration-500 group">
               <div class="relative w-full h-full bg-slate-50 flex flex-col items-center justify-center p-10 text-center space-y-6">
                  <div class="relative w-64 h-64 transition-transform group-hover:scale-110 duration-500">
                     <img 
                       src="~/assets/logo.png" 
                       alt="Веселая 3D змейка талисман" 
                       class="w-full h-full object-contain filter drop-shadow-xl animate-float"
                     />
                  </div>
                  <div class="hero-bubble bg-white px-6 py-4 rounded-3xl shadow-cartoon border-2 border-slate-100 font-black text-slate-800 text-lg relative">
                    "Привет! Давай прокачаем твои мозги!"
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-t-2 border-l-2 border-slate-100 transform rotate-45"></div>
                  </div>
               </div>
            </div>
            
            <div class="hero-floating-badge absolute -top-10 -right-10 bg-brand-yellow p-6 rounded-3xl shadow-cartoon transform rotate-12" aria-hidden="true">
                <div class="text-4xl text-white font-black">A+</div>
            </div>
            <div class="hero-floating-badge absolute -bottom-5 -left-5 bg-brand-blue p-5 rounded-3xl shadow-cartoon transform -rotate-6" aria-hidden="true">
                <div class="text-4xl text-white">🏆</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Advantages Section -->
    <section id="features" class="py-32 px-6 relative z-10">
      <div class="max-w-7xl mx-auto">
        <header class="text-center mb-20 max-w-3xl mx-auto space-y-4 reveal-on-scroll">
          <span class="text-brand-blue font-black uppercase tracking-widest text-sm bg-brand-blue/10 px-4 py-2 rounded-full">Преимущества</span>
          <h2 class="text-4xl md:text-5xl font-black text-slate-800">Учеба — это приключение,<br> а не скучная зубрежка!</h2>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-container">
          <article v-for="item in [
            { icon: '🤖', title: 'AI Проверка', desc: 'Наша змейка за секунду разберет твой код и найдет ошибки.', color: 'brand-green' },
            { icon: '📈', title: 'Твой Прогресс', desc: 'Следи за ростом своих навыков в реальном времени.', color: 'brand-blue' },
            { icon: '🎓', title: 'Сертификация', desc: 'Собери портфолио и получи красивый диплом от Змейки.', color: 'brand-yellow' }
          ]" :key="item.title" 
             @mousemove="handleFeatureMove($event)"
             @mouseleave="handleFeatureLeave($event)"
             class="feature-card reveal-on-scroll relative p-10 bg-white rounded-[3rem] border-4 border-slate-100 shadow-cartoon overflow-hidden transition-shadow duration-500 group cursor-default"
          >
            <!-- Background Layer -->
            <div class="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div class="relative z-10 space-y-8 pointer-events-none">
              <div class="icon-wrapper inline-block">
                <div class="icon-box w-24 h-24 rounded-[2rem] flex items-center justify-center text-6xl shadow-inner transition-transform duration-500" :class="[`bg-${item.color}/10`]">
                  {{ item.icon }}
                </div>
              </div>
              <div class="space-y-4">
                  <h3 class="text-3xl font-black text-slate-800">{{ item.title }}</h3>
                  <p class="font-bold text-slate-500 leading-relaxed text-lg">{{ item.desc }}</p>
              </div>
            </div>

            <!-- Trace Glow -->
            <div class="feature-glow absolute inset-0 opacity-0 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--x)_var(--y),_rgba(34,197,94,0.08)_0%,_transparent_70%)]"></div>
          </article>
        </div>
      </div>
    </section>

    <!-- PROCESS Section -->
    <section ref="processRef" id="process" class="relative h-[300vh]"> 
        <div class="sticky top-0 h-screen flex items-center justify-center bg-white overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" aria-hidden="true">
                <svg class="w-full h-full" viewBox="0 0 1440 800" fill="none">
                    <path d="M-100 400 Q 720 100 1540 400" stroke="#22C55E" stroke-width="40" stroke-linecap="round" stroke-dasharray="29 50"/>
                </svg>
            </div>

            <div class="max-w-7xl w-full mx-auto px-6 relative z-10 py-20">
                <div class="text-center mb-24">
                    <span class="text-brand-orange font-black uppercase tracking-widest text-sm bg-brand-orange/10 px-4 py-2 rounded-full">Как это работает</span>
                    <h2 class="text-4xl md:text-5xl font-black text-slate-800 mt-6">Путь джедая (то есть Змейки)</h2>
                    <p class="text-slate-500 font-bold mt-4 animate-bounce">👇 Крути колесико вниз 👇</p>
                </div>

                <div class="process-grid relative grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="hidden md:block snake-connector top-16 left-[12%] w-[26%]" aria-hidden="true">
                        <div class="snake-connector-fill bg-brand-green h-full w-0 rounded-full shadow-[0_0_15px_#22c55e]"></div>
                    </div>
                    <div class="hidden md:block snake-connector top-16 left-[37%] w-[26%]" aria-hidden="true">
                        <div class="snake-connector-fill bg-brand-blue h-full w-0 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
                    </div>
                    <div class="hidden md:block snake-connector top-16 left-[62%] w-[26%]" aria-hidden="true">
                        <div class="snake-connector-fill bg-brand-yellow h-full w-0 rounded-full shadow-[0_0_15px_#eab308]"></div>
                    </div>

                    <div v-for="(step, i) in [
                      { icon: '👋', title: 'Регистрация', desc: 'Выбирай персонажа', color: 'brand-green' },
                      { icon: '📺', title: 'Смотри уроки', desc: 'Видео без воды', color: 'brand-blue' },
                      { icon: '⚡', title: 'ИИ Практика', desc: 'Пиши код', color: 'brand-yellow' },
                      { icon: '🏆', title: 'Победа!', desc: 'Получай диплом', color: 'brand-orange' }
                    ]" :key="i" class="step-card relative text-center space-y-6" :class="{ 'active': currentStep >= i + 1 }">
                        <div class="step-icon w-32 h-32 mx-auto bg-slate-50 border-4 border-slate-100 rounded-full flex items-center justify-center text-5xl shadow-cartoon transition-all relative z-10"
                             :class="[`bg-${step.color}/10 border-${step.color}`]">
                            {{ step.icon }}
                            <div class="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white font-black border-4 border-white" :class="[`bg-${step.color}`]">{{ i + 1 }}</div>
                        </div>
                        <div class="step-content">
                            <h4 class="text-2xl font-black text-slate-800 mb-2">{{ step.title }}</h4>
                            <p class="text-slate-500 font-bold">{{ step.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PRICING Section -->
    <section id="pricing" class="py-32 px-6">
      <div class="max-w-7xl mx-auto">
        <header class="text-center mb-24 space-y-4 reveal-on-scroll">
            <span class="text-brand-green font-black uppercase tracking-widest text-sm bg-brand-green/10 px-4 py-2 rounded-full">Тарифы</span>
          <h2 class="text-4xl md:text-5xl font-black text-slate-800">Честные цены,<br> огромная польза</h2>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start perspective-container">
          <article v-for="(plan, i) in [
            { name: 'Старт', price: '0 ₽', sub: 'Для знакомства', items: ['Базовые курсы', '5 ИИ проверок', 'Сообщество'], color: 'slate' },
            { name: 'PRO Змейка', price: '490 ₽', sub: 'Макс. скорость', items: ['Все курсы', 'Безлимит ИИ', 'Поддержка 24/7'], color: 'brand-green', active: true },
            { name: 'Школам', price: 'B2B', sub: 'Для классов', items: ['Кабинет учителя', 'Аналитика', 'Скидки на опт'], color: 'brand-blue' }
          ]" :key="i" 
               class="pricing-card reveal-on-scroll group relative p-10 rounded-[3rem] border-4 space-y-8 flex flex-col transition-all"
               :class="[plan.active ? 'bg-slate-900 border-slate-900 shadow-2xl z-10' : 'bg-white border-slate-100 shadow-cartoon hover:z-20']"
               @mousemove="handleCardMove($event)"
               @mouseleave="handleCardLeave($event)"
          >
            <div v-if="plan.active" class="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-green text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-lg border-4 border-slate-900 flex items-center gap-2 transform transition-transform group-hover:scale-110 group-hover:-translate-y-2 z-20"><span>🔥</span> ХИТ СЕЗОНА</div>
            <div class="space-y-4" :class="[plan.active ? 'pt-4' : '']">
              <span class="font-black uppercase tracking-widest text-xs px-3 py-1 rounded-full" :class="[plan.active ? 'bg-brand-green/10 text-brand-green' : 'bg-slate-100 text-slate-400']">{{ plan.name }}</span>
              <h4 class="text-5xl font-black" :class="[plan.active ? 'text-white' : 'text-slate-800']">{{ plan.price }}</h4>
              <p class="text-slate-400 font-bold">{{ plan.sub }}</p>
            </div>
            <div class="h-1 w-full rounded-full" :class="[plan.active ? 'bg-slate-800' : 'bg-slate-50']"></div>
            <ul class="space-y-4 flex-grow font-bold" :class="[plan.active ? 'text-slate-300' : 'text-slate-500']">
              <li v-for="item in plan.items" :key="item" class="flex items-center gap-3">
                <span class="text-brand-green" aria-hidden="true">✓</span> <span :class="[plan.active && item.includes('Все') ? 'text-white' : '']">{{ item }}</span>
              </li>
            </ul>
            <button class="w-full py-5 rounded-2xl font-black transition-all shadow-cartoon text-lg focus:ring-4 outline-none" 
                    :class="[plan.active ? 'bg-brand-green text-white shadow-[0_6px_0_0_#166534] focus:ring-brand-green/30' : 'bg-white border-4 border-slate-100 text-slate-400 hover:bg-slate-50 focus:ring-slate-100']">
              {{ plan.price === 'B2B' ? 'Связаться' : 'Выбрать' }}
            </button>
            
            <!-- Spotlight Glow Overlay -->
            <div class="card-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 rounded-[3rem]" aria-hidden="true"></div>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-20 px-6 max-w-4xl mx-auto reveal-on-scroll">
      <header class="text-center mb-16 text-slate-800">
        <h2 class="text-3xl md:text-4xl font-black">Частые вопросы</h2>
        <p class="text-slate-500 font-bold mt-4">Всё, что ты хотел узнать, но стеснялся спросить</p>
      </header>
      <div class="faq-container space-y-4">
        <article v-for="(item, index) in faqItems" :key="index"
             class="faq-item bg-white border-4 border-slate-100 rounded-3xl overflow-hidden transition-all duration-300"
             :class="activeFaq === index ? 'border-brand-green/30 shadow-cartoon' : 'hover:border-slate-200'">
          <button 
            @click="toggleFaq(index)" 
            :aria-expanded="activeFaq === index"
            class="w-full flex items-center justify-between p-6 text-left font-black text-lg text-slate-700 outline-none select-none focus:bg-slate-50"
          >
            {{ item.q }}
            <span class="plus-icon text-3xl transition-transform duration-300 transform flex items-center justify-center w-8 h-8 rounded-full"
                  :class="activeFaq === index ? 'rotate-45 text-brand-green bg-brand-green/10' : 'text-slate-400'" aria-hidden="true">+</span>
          </button>
          <div class="grid transition-[grid-template-rows] duration-500 ease-out" :style="{ 'grid-template-rows': activeFaq === index ? '1fr' : '0fr' }">
            <div class="overflow-hidden">
              <div class="p-6 pt-0 text-slate-600 font-bold leading-relaxed border-t-2 border-slate-50 mt-2">{{ item.a }}</div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-32 px-6 reveal-on-scroll">
      <div class="max-w-6xl mx-auto relative group">
        <div class="absolute -inset-4 bg-gradient-to-r from-brand-green to-brand-blue rounded-[4rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" aria-hidden="true"></div>
        <div class="relative bg-slate-900 rounded-[3.5rem] p-12 md:p-24 overflow-hidden border-8 border-slate-800 shadow-2xl">
          <div class="absolute inset-0 opacity-30" aria-hidden="true">
             <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green rounded-full filter blur-[100px] animate-blob"></div>
             <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue rounded-full filter blur-[100px] animate-blob animation-delay-4000"></div>
          </div>
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div class="cta-content space-y-8 text-center lg:text-left">
                <span class="inline-block px-4 py-2 bg-white/10 text-white rounded-full font-bold text-sm uppercase tracking-widest backdrop-blur-md border border-white/10">✨ Твой код к успеху</span>
                <h2 class="text-4xl md:text-6xl font-black text-white leading-[1.1] drop-shadow-lg">Стань повелителем <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow">питонов</span></h2>
                <p class="text-slate-300 text-xl font-bold max-w-lg mx-auto lg:mx-0 leading-relaxed">Хватит откладывать. Всего 15 минут в день, и через месяц ты напишешь свою первую игру.</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                   <NuxtLink to="/dashboard" aria-label="Начать прямо сейчас" class="bg-brand-green px-10 py-5 rounded-2xl font-black text-white text-xl shadow-[0_8px_0_0_#166534] hover:translate-y-1 hover:shadow-[0_4px_0_0_#166534] transition-all active:translate-y-2 active:shadow-none btn-bouncy text-decoration-none focus:ring-4 focus:ring-brand-green/30 outline-none">Начать сейчас</NuxtLink>
                </div>
             </div>
             <div class="cta-image relative h-[400px] flex items-center justify-center pointer-events-none">
                <img src="~/assets/logo.png" alt="Snake Mascot" class="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-float transform scale-125 lg:scale-150 rotate-[-10deg]" />
             </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// SEO Meta management
useHead({
  title: 'Zmeyka — Твой интерактивный ИИ-наставник в мире IT',
  meta: [
    { name: 'description', content: 'Освой Python и основы IT с помощью самого доброго в мире ИИ-наставника. Мгновенная проверка кода, геймификация и личный диплом.' },
    { name: 'keywords', content: 'курсы программирования, python для новичков, обучение ИИ, змейка обучение, IT школа' },
    { property: 'og:title', content: 'Zmeyka — Учись кодить играя' },
    { property: 'og:description', content: 'Интерактивная платформа с ИИ-проверкой домашних заданий. Начни бесплатно прямо сейчас!' },
    { property: 'og:url', content: 'https://zmeyka.io' },
    { property: 'og:image', content: 'https://zmeyka.io/og-image.png' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://zmeyka.io/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://zmeyka.io' }
  ],
  htmlAttrs: { lang: 'ru' }
})

const processRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const currentStep = ref(0)
const activeFaq = ref<number | null>(0)

const faqItems = [
  { q: "Нужно ли знать математику?", a: "Логика важнее формул! Если умеешь считать до десяти — ты справишься." },
  { q: "Как работает ИИ проверка?", a: "Мы используем Gemini. Твой код анализируется за секунды с подробным разбором." },
  { q: "С какого возраста?", a: "Оптимально от 10 лет, но главное — желание учиться." },
  { q: "Это бесплатно?", a: "Есть тариф 'Старт' с базой. PRO — для тех, кто хочет максимум." }
]

const toggleFaq = (index: number) => { activeFaq.value = activeFaq.value === index ? null : index }

const initHeroAnimations = () => {
  const words = document.querySelectorAll('.hero-word')
  const badge = document.querySelector('.hero-badge')
  if (!badge) return

  gsap.set(words, { y: 60, rotateX: -90, opacity: 0 })
  gsap.set(badge, { y: -40, opacity: 0 })

  const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } })
  tl.fromTo(badge, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "back.out(1.7)" }, 0.2)
  tl.to(words, { y: 0, rotateX: 0, opacity: 1, stagger: 0.1 }, 0.4)
  tl.from('.hero-description', { y: 20, opacity: 0 }, 0.8)
  tl.from('.hero-cta button, .hero-cta a', { scale: 0.8, opacity: 0, stagger: 0.1, ease: 'back.out(2)' }, 1)
  tl.from('.hero-image', { x: 50, opacity: 0, duration: 1.5 }, 0.5)

  const onMouseMove = (e: MouseEvent) => {
    words.forEach((word) => {
      const rect = word.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist < 300) {
        const power = (300 - dist) / 300
        gsap.to(word, { x: dx * power * 0.1, y: dy * power * 0.1, skewX: dx * power * 0.05, duration: 0.6 })
      } else {
        gsap.to(word, { x: 0, y: 0, skewX: 0, duration: 1 })
      }
    })
  }
  window.addEventListener('mousemove', onMouseMove)
  return onMouseMove
}

const initSnakeCursor = () => {
  const dots = document.querySelectorAll('.cursor-dot')
  const main = document.querySelector('.cursor-main')
  if (!dots.length || !main) return
  const onMouseMove = (e: MouseEvent) => {
    gsap.to(dots, { x: e.clientX, y: e.clientY, stagger: 0.04, duration: 0.5, ease: 'power2.out' })
    gsap.to(main, { x: e.clientX, y: e.clientY, duration: 0.1 })
  }
  window.addEventListener('mousemove', onMouseMove)
  return onMouseMove
}

const initMagneticButtons = () => {
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to('.cursor-main', { scale: 3, duration: 0.3 }))
    btn.addEventListener('mousemove', (e: any) => {
      const rect = btn.getBoundingClientRect()
      gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.5 })
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to('.cursor-main', { scale: 1, duration: 0.3 })
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out' })
    })
  })
}

const handleHeroParallax = (e: MouseEvent) => {
  if (!heroRef.value) return
  const mx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
  const my = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
  gsap.to('.hero-card', { x: mx * 30, y: my * 30, duration: 1 })
  gsap.to('.hero-bg-blob', { x: mx * -50, y: my * -50, duration: 1.5 })
  gsap.to('.hero-floating-badge', { x: (i) => mx * (i === 0 ? 40 : -40), y: (i) => my * (i === 0 ? 60 : -60), duration: 1.2 })
}

const handleCardMove = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const xc = rect.width / 2
  const yc = rect.height / 2
  const dx = x - xc
  const dy = y - yc
  
  gsap.to(card, {
    rotateX: (dy / yc) * -6,
    rotateY: (dx / xc) * 6,
    scale: 1.03,
    duration: 0.6,
    ease: 'power2.out',
    overwrite: 'auto'
  })

  const spotlight = card.querySelector('.card-spotlight') as HTMLElement
  if (spotlight) {
    gsap.set(spotlight, { opacity: 1 })
    gsap.to(spotlight, {
      background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 80%)`,
      duration: 0.2
    })
  }
}

const handleCardLeave = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    duration: 0.8,
    ease: 'elastic.out(1, 0.5)',
    overwrite: 'auto'
  })
  
  const spotlight = card.querySelector('.card-spotlight') as HTMLElement
  if (spotlight) {
    gsap.to(spotlight, { opacity: 0, duration: 0.5 })
  }
}

const handleFeatureMove = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  card.style.setProperty('--x', `${x}px`)
  card.style.setProperty('--y', `${y}px`)
  
  const xc = rect.width / 2
  const yc = rect.height / 2
  const dx = x - xc
  const dy = y - yc
  
  gsap.to(card, {
    rotateX: (dy / yc) * -5,
    rotateY: (dx / xc) * 5,
    duration: 0.6,
    ease: 'power2.out',
    overwrite: 'auto'
  })
  
  const icon = card.querySelector('.icon-wrapper') as HTMLElement
  if (icon) {
    gsap.to(icon, {
      x: (dx / xc) * 20,
      y: (dy / yc) * 20,
      scale: 1.1,
      duration: 0.4,
      ease: 'power1.out'
    })
  }

  const glow = card.querySelector('.feature-glow') as HTMLElement
  if (glow) gsap.to(glow, { opacity: 1, duration: 0.3 })
}

const handleFeatureLeave = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'back.out(1.2)' })
  
  const icon = card.querySelector('.icon-wrapper') as HTMLElement
  if (icon) gsap.to(icon, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' })
  
  const glow = card.querySelector('.feature-glow') as HTMLElement
  if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 })
}

let heroMouseMove: any = null
let cursorMouseMove: any = null

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  initMagneticButtons()

  // Only init mouse-heavy animations on fine-pointer devices (Desktop)
  if (!isTouchDevice()) {
    cursorMouseMove = initSnakeCursor()
    heroMouseMove = initHeroAnimations()
  }

  gsap.utils.toArray<HTMLElement>('.reveal-on-scroll:not(#features *, #faq *)').forEach(el => {
    gsap.to(el, { 
      scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' }, 
      y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out' 
    })
  })

  const featuresSection = document.querySelector('#features')
  if (featuresSection) {
    const cards = featuresSection.querySelectorAll('.feature-card')
    const header = featuresSection.querySelector('header')
    const icons = featuresSection.querySelectorAll('.icon-wrapper')
    
    gsap.set(cards, { y: 100, autoAlpha: 0, rotationX: -15, transformOrigin: 'center bottom' })
    gsap.set(icons, { y: 30, autoAlpha: 0, scale: 0.8 })

    const featuresTL = gsap.timeline({
      scrollTrigger: {
        trigger: featuresSection,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    })

    featuresTL.to(header, { y: 0, autoAlpha: 1, duration: 1 })
    featuresTL.to(cards, {
      y: 0,
      autoAlpha: 1,
      rotationX: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out'
    }, '-=0.6')
    
    featuresTL.to(icons, {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'back.out(1.7)'
    }, '-=1')
  }

  const faqSection = document.querySelector('#faq')
  if (faqSection) {
    const items = faqSection.querySelectorAll('.faq-item')
    const header = faqSection.querySelector('header')

    const faqTL = gsap.timeline({
      scrollTrigger: {
        trigger: faqSection,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })

    faqTL.to(header, { y: 0, autoAlpha: 1, duration: 1 })
    faqTL.to(items, {
      y: 0,
      autoAlpha: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
  }

  if (processRef.value) {
    const fills = gsap.utils.toArray<HTMLElement>('.snake-connector-fill')
    const icons = gsap.utils.toArray<HTMLElement>('.step-icon')
    gsap.timeline({
      scrollTrigger: {
        trigger: processRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (s) => {
          currentStep.value = s.progress < 0.1 ? 1 : s.progress < 0.35 ? 2 : s.progress < 0.65 ? 3 : 4
        }
      }
    })
    .to(fills[0], { width: '100%' })
    .to(icons[1], { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }, '-=0.1')
    .to(fills[1], { width: '100%' })
    .to(icons[2], { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }, '-=0.1')
    .to(fills[2], { width: '100%' })
    .to(icons[3], { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }, '-=0.1')
  }

  gsap.to('.cta-badge', { y: -15, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3 })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  gsap.killTweensOf('*')
  if (cursorMouseMove) window.removeEventListener('mousemove', cursorMouseMove)
  if (heroMouseMove) window.removeEventListener('mousemove', heroMouseMove)
})
</script>

<style scoped>
.perspective-container { perspective: 2000px; }
.pricing-card { 
  transform-style: preserve-3d;
  transition: box-shadow 0.3s ease;
}
.pricing-card:hover {
  box-shadow: 0 40px 80px -20px rgba(0,0,0,0.15);
}
.feature-card {
  transform-style: preserve-3d;
  will-change: transform;
}
.feature-card:hover {
  border-color: var(--color-brand-green);
  box-shadow: 0 40px 80px -20px rgba(34, 197, 94, 0.1);
}
.icon-wrapper {
  transform: translateZ(50px);
  will-change: transform;
}
.card-spotlight {
  background: radial-gradient(600px circle at 0px 0px, rgba(255,255,255,0.1), transparent 80%);
  z-index: 1;
}

/* Visible focus state for accessibility */
:focus-visible {
  outline: 4px solid #22C55E !important;
  outline-offset: 4px;
}
</style>
