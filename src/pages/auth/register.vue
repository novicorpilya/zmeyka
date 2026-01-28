<template>
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
    <!-- Decorative background elements -->
    <div class="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-yellow/10 rounded-full blur-[100px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>

    <div class="w-full max-w-lg relative z-10 space-y-8">
      <!-- Logo / Back Link -->
      <div class="text-center space-y-4">
        <NuxtLink to="/" class="inline-flex items-center gap-2 group">
           <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-cartoon border-2 border-slate-100 group-hover:scale-110 transition-transform">
             <img src="~/assets/logo.png" alt="Zmeyka" class="w-8 h-8 object-contain">
           </div>
           <span class="text-2xl font-black text-slate-800 tracking-tighter">Zmeyka</span>
        </NuxtLink>
        <h1 class="text-4xl font-black text-slate-800 tracking-tight">Стань частью террариума!</h1>
        <p class="text-slate-400 font-bold">Начни свой путь к IT-вершинам прямо сейчас ✨</p>
      </div>

      <!-- Auth Card -->
      <div class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Твоё имя</label>
            <div class="relative group">
              <input 
                v-model="form.name"
                type="text" 
                placeholder="Юный змеелов"
                required
                class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-yellow focus:bg-white transition-all placeholder:text-slate-300"
              />
              <span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all">👋</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
            <div class="relative group">
              <input 
                v-model="form.email"
                type="email" 
                placeholder="serpent@expert.io"
                required
                class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all placeholder:text-slate-300"
              />
              <span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all">📧</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Пароль</label>
            <div class="relative group">
              <input 
                v-model="form.password"
                type="password" 
                placeholder="Минимум 6 символов"
                required
                minlength="6"
                class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-blue focus:bg-white transition-all placeholder:text-slate-300"
              />
              <span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all">🔐</span>
            </div>
          </div>

          <div v-if="error" class="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-500 font-bold text-sm flex items-center gap-3">
             <span class="text-xl">⚠️</span> {{ error }}
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-brand-yellow py-5 rounded-2xl font-black text-white text-xl shadow-[0_8px_0_0_#a16207] hover:translate-y-0.5 hover:shadow-[0_6px_0_0_#a16207] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
          >
            <span v-if="loading" class="animate-spin text-2xl">⏳</span>
            <span v-else>Вылупиться! 🐣</span>
          </button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t-4 border-slate-50"></div>
          </div>
          <div class="relative flex justify-center text-sm uppercase font-black">
            <span class="bg-white px-4 text-slate-300 tracking-widest">Либо через</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button class="flex items-center justify-center gap-3 py-4 bg-white border-4 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-6 h-6" alt="Google">
            Google
          </button>
          <button class="flex items-center justify-center gap-3 py-4 bg-white border-4 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" class="w-6 h-6" alt="GitHub">
            GitHub
          </button>
        </div>
      </div>

      <p class="text-center font-bold text-slate-500">
        Уже есть аккаунт? 
        <NuxtLink to="/auth/login" class="text-brand-blue underline decoration-4 underline-offset-4 hover:text-brand-blue/80 transition-colors">Войти в гнездо</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthApi } from '@features/auth/api'
import { useUserStore } from '@entities/user/model/store'

const router = useRouter()
const { register } = useAuthApi()
const userStore = useUserStore()

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response: any = await register(form)
    userStore.setUser(response.user, response.token)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Ошибка регистрации. Попробуй другой email!'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false
})
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 15px 0 0 #f1f5f9;
}
input:focus {
  filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.1));
}
</style>
