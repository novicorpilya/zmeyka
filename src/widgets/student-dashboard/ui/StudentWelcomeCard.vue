<template>
  <section
    class="relative overflow-hidden bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-slate-100 shadow-cartoon group"
  >
    <div
      class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8"
    >
      <div class="space-y-4 text-center md:text-left order-2 md:order-1">
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest"
        >
          🐍 Твой ИИ-наставник онлайн
        </div>
        <h1
          class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight"
        >
          С возвращением, <br class="sm:hidden" />
          <span class="text-brand-green">{{ name || 'Ученик' }}</span
          >!
        </h1>
        <p class="text-base sm:text-lg font-bold text-slate-400 max-w-xl">
          Твоя змейка заждалась! Сегодня отличный день, чтобы освоить пару новых функций.
        </p>
        <div
          class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2"
        >
          <NuxtLink
            to="/courses"
            class="w-full sm:w-auto bg-brand-green px-8 py-4 rounded-2xl font-black text-white shadow-[0_6px_0_0_#166534] hover:shadow-[0_4px_0_0_#166534] hover:translate-y-0.5 transition-all flex items-center justify-center gap-3"
          >
            Учиться 🚀
          </NuxtLink>
          <div
            class="flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold text-slate-500 text-sm"
          >
            <span class="text-xl">🔥</span> {{ streak }} дней ударно
          </div>
        </div>
      </div>

      <div
        class="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 flex-shrink-0 order-1 md:order-2"
      >
        <div
          class="absolute inset-0 bg-brand-green/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"
        ></div>
        <img
          :src="logoImage"
          alt="Mascot"
          class="w-full h-full object-contain filter drop-shadow-2xl animate-float relative z-10"
        />
      </div>
    </div>
    <div
      class="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-slate-50/50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"
    ></div>
  </section>
</template>

<script setup lang="ts">
import logoImage from '@shared/assets/logo.png'

defineProps<{
  name?: string
  streak: number
}>()
</script>
