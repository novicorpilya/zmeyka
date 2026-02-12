<script setup lang="ts">
import logoImage from '~/assets/logo.png'
import { useAuthApi } from '~/features/auth/api'

const { forgotPassword } = useAuthApi()

const email = ref('')
const isLoading = ref(false)
const message = ref('')
const error = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  message.value = ''

  try {
    const response = (await forgotPassword(email.value)) as { message?: string }
    message.value = response.message || 'Ссылка для сброса пароля отправлена на почту'
  } catch (err: unknown) {
    const errorData = err as { data?: { message?: string }; message?: string }
    error.value = errorData.data?.message || 'Произошла ошибка при отправке'
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  layout: false,
})
</script>

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

    <div class="w-full max-w-lg relative z-10 space-y-8">
      <div class="text-center space-y-4">
        <NuxtLink to="/" class="inline-flex items-center gap-2 group">
          <div
            class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-cartoon border-2 border-slate-100 group-hover:scale-110 transition-transform"
          >
            <img :src="logoImage" alt="Zmeyka" class="w-8 h-8 object-contain" />
          </div>
          <span class="text-2xl font-black text-slate-800 tracking-tighter">Zmeyka</span>
        </NuxtLink>
        <h1 class="text-4xl font-black text-slate-800 tracking-tight">Вспомним всё!</h1>
        <p class="text-slate-400 font-bold">Введи почту, и мы пришлем ключ для входа 🐍</p>
      </div>

      <div class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1"
              >Email</label
            >
            <div class="relative group">
              <input
                v-model="email"
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

          <div
            v-if="error"
            class="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-500 font-bold text-sm flex items-center gap-3"
          >
            <span class="text-xl">⚠️</span> {{ error }}
          </div>

          <div
            v-if="message"
            class="p-4 bg-green-50 border-2 border-green-100 rounded-2xl text-green-600 font-bold text-sm flex items-center gap-3"
          >
            <span class="text-xl">✅</span> {{ message }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-brand-green py-5 rounded-2xl font-black text-white text-xl shadow-[0_8px_0_0_#166534] hover:translate-y-0.5 hover:shadow-[0_6px_0_0_#166534] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
          >
            <span v-if="isLoading" class="animate-spin text-2xl">⏳</span>
            <span v-else>Отправить ключ</span>
          </button>
        </form>

        <div class="text-center pt-2">
          <NuxtLink
            to="/login"
            class="text-sm font-black text-slate-400 hover:text-brand-green transition-colors"
          >
            Я вспомнил пароль!
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 15px 0 0 #f1f5f9;
}
</style>
