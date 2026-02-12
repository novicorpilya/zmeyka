<template>
  <section id="contact" class="py-24 md:py-40 relative overflow-hidden bg-white">
    <!-- Geometric Background Decor -->
    <div class="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-100 rounded-full blur-[140px]"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[140px]"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        <!-- Left Side: Content -->
        <div class="contact-content space-y-10">
          <div class="space-y-6">
            <h2 class="text-xs md:text-sm font-black text-emerald-500 uppercase tracking-[0.4em]">
              Связь с нами
            </h2>
            <h3
              class="text-4xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter"
            >
              Есть вопросы? <br />
              Пиши,
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600"
                >не стесняйся</span
              >
            </h3>
            <p class="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md">
              Мы всегда открыты для предложений, вопросов по обучению или сотрудничества.
            </p>
          </div>

          <!-- Contact Options -->
          <div class="space-y-8 pt-4">
            <div class="flex items-center gap-6 group">
              <div
                class="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-500"
              >
                📫
              </div>
              <div>
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Email</p>
                <a
                  href="mailto:hello@zmeyka.io"
                  class="text-xl font-black text-slate-900 hover:text-emerald-500 transition-colors"
                  >hello@zmeyka.io</a
                >
              </div>
            </div>

            <div class="flex items-center gap-6 group">
              <div
                class="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-500"
              >
                💬
              </div>
              <div>
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Telegram</p>
                <a
                  href="https://t.me/zmeyka_edu"
                  target="_blank"
                  class="text-xl font-black text-slate-900 hover:text-blue-500 transition-colors"
                  >@zmeyka_edu</a
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Form -->
        <div class="contact-form-wrapper relative">
          <!-- Form Outer Glow -->
          <div
            class="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-[3rem] blur-2xl opacity-70"
          ></div>

          <div
            class="relative bg-white/70 backdrop-blur-xl border border-white rounded-[3rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)]"
          >
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1"
                    >Имя</label
                  >
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Как тебя зовут?"
                    class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1"
                    >Email</label
                  >
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="Для ответа"
                    class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1"
                  >Сообщение</label
                >
                <textarea
                  v-model="form.message"
                  placeholder="Задай свой вопрос или предложи идею..."
                  rows="4"
                  class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-900 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-5 bg-slate-900 text-white font-black text-lg uppercase tracking-widest rounded-2xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <span v-if="!isSubmitting">Отправить ласточку</span>
                <span v-else class="flex gap-1">
                  <span
                    class="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                    style="animation-delay: 0.1s"
                  ></span>
                  <span
                    class="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                    style="animation-delay: 0.2s"
                  ></span>
                  <span
                    class="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                    style="animation-delay: 0.3s"
                  ></span>
                </span>
                <span v-if="!isSubmitting">🚀</span>
              </button>
            </form>

            <!-- Success Overlay -->
            <div
              v-if="isSuccess"
              class="absolute inset-0 bg-white/90 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center p-8 text-center animate-fade-in"
            >
              <div
                class="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-4xl mb-6 scale-up"
              >
                ✅
              </div>
              <h4 class="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Улетело!
              </h4>
              <p class="text-slate-500 font-bold max-w-xs uppercase text-xs tracking-widest">
                Мы получили твое сообщение и ответим в ближайшие 24 часа.
              </p>
              <button
                @click="resetForm"
                class="mt-8 text-emerald-500 font-black uppercase text-xs tracking-widest hover:underline"
              >
                Отправить еще одно
              </button>
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
import { ref, reactive, onMounted } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  isSubmitting.value = false
  isSuccess.value = true

  // In real app, we would use our `useApi` here
}

const resetForm = () => {
  isSuccess.value = false
  Object.assign(form, { name: '', email: '', message: '' })
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  gsap.from('.contact-content > *', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
    },
    x: -100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'expo.out',
  })

  gsap.from('.contact-form-wrapper', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
    },
    x: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'expo.out',
  })
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.scale-up {
  animation: scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes scaleUp {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
