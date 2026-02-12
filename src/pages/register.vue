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

    <div class="w-full max-w-2xl relative z-10 space-y-6 md:space-y-8">
      <!-- Logo / Back Link -->
      <div class="text-center space-y-4">
        <NuxtLink to="/" class="inline-flex items-center gap-2 group">
          <div
            class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-premium border-2 border-slate-100 group-hover:scale-110 transition-transform"
          >
            <img :src="logoImage" alt="Змейка" class="w-5 h-5 md:w-6 md:h-6 object-contain" />
          </div>
          <span class="text-lg md:text-xl font-black text-slate-800 tracking-tighter">Змейка</span>
        </NuxtLink>
      </div>

      <!-- Step 1: Role Selection -->
      <RoleSelector v-if="step === 1" @select="selectRole" />

      <!-- Step 2: Form Details -->
      <RegisterForm
        v-if="step === 2"
        v-model:name="form.name"
        v-model:email="form.email"
        v-model:password="form.password"
        :loading="loading"
        :error="error"
        @submit="handleRegister"
        @back="goBack"
      />

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
import logoImage from '~/assets/logo.png'
import { useRegistration } from '~/features/auth/model/useRegistration'
import RegisterForm from '~/features/auth/ui/RegisterForm.vue'
import RoleSelector from '~/features/auth/ui/RoleSelector.vue'

const { step, form, loading, error, selectRole, handleRegister, goBack } = useRegistration()

definePageMeta({
  layout: false,
  middleware: ['guest'],
})
</script>

<style scoped>
input:focus {
  filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.1));
}
</style>
