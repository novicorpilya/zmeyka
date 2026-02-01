<template>
  <div
    class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50"
  >
    <!-- Decorative background elements -->
    <div
      class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[100px] animate-pulse"
    ></div>
    <div
      class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[100px] animate-pulse"
      style="animation-delay: 2s"
    ></div>

    <div class="w-full max-w-2xl relative z-10 space-y-8">
      <!-- Logo / Back Link -->
      <div class="text-center space-y-4">
        <NuxtLink to="/" class="inline-flex items-center gap-2 group">
          <div
            class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-cartoon-sm border-2 border-slate-100 group-hover:scale-110 transition-transform"
          >
            <img src="~/assets/logo.png" alt="Zmeyka" class="w-6 h-6 object-contain" />
          </div>
          <span class="text-xl font-black text-slate-800 tracking-tighter">Zmeyka</span>
        </NuxtLink>
      </div>

      <!-- Step 1: Role Selection -->
      <div v-if="step === 1" class="space-y-10 animate-in fade-in zoom-in duration-500">
        <div class="text-center space-y-4">
          <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
            Выбери свой путь 🗺️
          </h1>
          <p class="text-slate-400 font-bold text-lg">Кто ты в мире Zmeyka?</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Student Card -->
          <button
            @click="selectRole('STUDENT')"
            class="group bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon hover:border-brand-green hover:translate-y-[-8px] transition-all text-left space-y-6 relative overflow-hidden"
          >
            <div
              class="w-20 h-20 bg-brand-green/10 rounded-3xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform"
            >
              🐍
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-black text-slate-800">Ученик</h3>
              <p class="font-bold text-slate-400 leading-snug">
                Хочу учиться программированию, сдавать ДЗ и получать медали.
              </p>
            </div>
            <div
              class="pt-4 flex items-center gap-2 text-brand-green font-black uppercase tracking-widest text-xs"
            >
              Начать обучение →
            </div>
            <div
              class="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-green/5 rounded-full group-hover:scale-150 transition-transform"
            ></div>
          </button>

          <!-- Teacher Card -->
          <button
            @click="selectRole('TEACHER')"
            class="group bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon hover:border-brand-blue hover:translate-y-[-8px] transition-all text-left space-y-6 relative overflow-hidden"
          >
            <div
              class="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform"
            >
              👨‍🏫
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-black text-slate-800">Учитель</h3>
              <p class="font-bold text-slate-400 leading-snug">
                Хочу создавать курсы, делиться знаниями и проверять работы.
              </p>
            </div>
            <div
              class="pt-4 flex items-center gap-2 text-brand-blue font-black uppercase tracking-widest text-xs"
            >
              Стать наставником →
            </div>
            <div
              class="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-blue/5 rounded-full group-hover:scale-150 transition-transform"
            ></div>
          </button>
        </div>
      </div>

      <!-- Step 2: Form Details -->
      <div
        v-if="step === 2"
        class="max-w-lg mx-auto animate-in slide-in-from-right-10 fade-in duration-500"
      >
        <div class="text-center space-y-4 mb-8">
          <button
            @click="step = 1"
            class="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 flex items-center justify-center gap-2 mx-auto"
          >
            ← Назад к выбору
          </button>
          <h1 class="text-4xl font-black text-slate-800 tracking-tight">Почти готово! ✨</h1>
          <p class="text-slate-400 font-bold">Осталось только создать твой шифр</p>
        </div>

        <div
          class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8"
        >
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Full Name -->
            <div class="space-y-2">
              <label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1"
                >Как тебя зовут?</label
              >
              <div class="relative group">
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Твоё имя"
                  required
                  class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-yellow focus:bg-white transition-all placeholder:text-slate-300"
                />
                <span
                  class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all"
                  >👋</span
                >
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1"
                >Email</label
              >
              <div class="relative group">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="serpent@expert.io"
                  required
                  class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all placeholder:text-slate-300"
                />
                <span
                  class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all"
                  >📧</span
                >
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1"
                >Придумай шифр</label
              >
              <div class="relative group">
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  required
                  class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-blue focus:bg-white transition-all placeholder:text-slate-300"
                />
                <span
                  class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all"
                  >🔑</span
                >
              </div>
            </div>

            <div
              v-if="error"
              class="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-500 font-bold text-sm flex items-center gap-3"
            >
              <span class="text-xl">⚠️</span> {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-brand-yellow py-5 rounded-2xl font-black text-slate-800 text-xl shadow-[0_8px_0_0_#ca8a04] hover:translate-y-0.5 hover:shadow-[0_6px_0_0_#ca8a04] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <span v-if="loading" class="animate-spin text-2xl">⏳</span>
              <span v-else>Вылупиться в IT</span>
            </button>
          </form>
        </div>
      </div>

      <p class="text-center font-bold text-slate-500">
        Уже есть аккаунт?
        <NuxtLink
          to="/login"
          class="text-brand-blue underline decoration-4 underline-offset-4 hover:text-brand-blue/80 transition-colors"
          >Заползти обратно</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/entities/user/model/store'
import { useAuthApi } from '~/features/auth/api'

const router = useRouter()
const userStore = useUserStore()
const { register } = useAuthApi()

const step = ref(1)
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'STUDENT',
})

const loading = ref(false)
const error = ref('')

const selectRole = (role: 'STUDENT' | 'TEACHER') => {
  form.role = role
  step.value = 2
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await register(form)
    userStore.setUser(response.user, response.accessToken)
    router.push('/dashboard')
  } catch (err: unknown) {
    const errorData = err as { data?: { message?: string }; message?: string }
    error.value =
      errorData.data?.message || errorData.message || 'Ошибка регистрации. Попробуй другую почту!'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false,
  middleware: ['guest'],
})
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 15px 0 0 #f1f5f9;
}
.shadow-cartoon-sm {
  box-shadow: 0 8px 0 0 #f1f5f9;
}
input:focus {
  filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.1));
}
</style>
