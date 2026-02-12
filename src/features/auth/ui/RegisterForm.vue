<template>
  <div class="max-w-lg mx-auto animate-in slide-in-from-right-10 fade-in duration-500">
    <div class="text-center space-y-3 md:space-y-4 mb-6 md:mb-8">
      <button
        @click="$emit('back')"
        class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 flex items-center justify-center gap-2 mx-auto"
      >
        ← Назад к выбору
      </button>
      <h1 class="text-2xl xs:text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
        Почти готово! ✨
      </h1>
      <p class="text-slate-400 font-bold text-sm md:text-base">Осталось только создать твой шифр</p>
    </div>

    <div
      class="bg-white p-6 xs:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-6 md:space-y-8"
    >
      <form @submit.prevent="$emit('submit')" class="space-y-6">
        <!-- Full Name -->
        <div class="space-y-1.5 md:space-y-2">
          <label
            class="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest px-1"
            >Как тебя зовут?</label
          >
          <div class="relative group">
            <input
              :value="name"
              @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Твоё имя"
              required
              class="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border-2 md:border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-yellow focus:bg-white transition-all placeholder:text-slate-300 text-sm md:text-base"
            />
            <span
              class="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-xl md:text-2xl grayscale group-focus-within:grayscale-0 transition-all"
              >👋</span
            >
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-1.5 md:space-y-2">
          <label
            class="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest px-1"
            >Email</label
          >
          <div class="relative group">
            <input
              :value="email"
              @input="$emit('update:email', ($event.target as HTMLInputElement).value)"
              type="email"
              placeholder="serpent@expert.io"
              required
              class="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border-2 md:border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all placeholder:text-slate-300 text-sm md:text-base"
            />
            <span
              class="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-xl md:text-2xl grayscale group-focus-within:grayscale-0 transition-all"
              >📧</span
            >
          </div>
        </div>

        <!-- Password -->
        <div class="space-y-1.5 md:space-y-2">
          <label
            class="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest px-1"
            >Придумай шифр</label
          >
          <div class="relative group">
            <input
              :value="password"
              @input="$emit('update:password', ($event.target as HTMLInputElement).value)"
              type="password"
              placeholder="Минимум 6 символов"
              required
              class="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border-2 md:border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-blue focus:bg-white transition-all placeholder:text-slate-300 text-sm md:text-base"
            />
            <span
              class="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-xl md:text-2xl grayscale group-focus-within:grayscale-0 transition-all"
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
          class="w-full bg-brand-yellow py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-slate-800 text-lg md:text-xl shadow-[0_6px_0_0_#ca8a04] md:shadow-[0_8px_0_0_#ca8a04] hover:shadow-[0_4px_0_0_#ca8a04] md:hover:shadow-[0_6px_0_0_#ca8a04] active:translate-y-1 md:active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 md:gap-3"
        >
          <span v-if="loading" class="animate-spin text-xl md:text-2xl">⏳</span>
          <span v-else>Вылупиться в IT</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  email: string
  password: string
  loading: boolean
  error: string
}>()

defineEmits<{
  (e: 'update:name', value: string): void
  (e: 'update:email', value: string): void
  (e: 'update:password', value: string): void
  (e: 'submit'): void
  (e: 'back'): void
}>()
</script>
