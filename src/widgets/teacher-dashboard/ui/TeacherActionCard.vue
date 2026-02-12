<template>
  <section
    class="bg-brand-blue p-8 rounded-[3rem] shadow-[0_12px_0_0_#1e40af] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
  >
    <div class="space-y-4 relative z-10 text-center md:text-left">
      <h2 class="text-3xl font-black leading-tight">
        Создай новое <br />
        IT-приключение!
      </h2>
      <p class="font-bold text-white/80">
        Твои знания — это суперсила. Поделись ими со студентами через интерактивные уроки.
      </p>
      <NuxtLink
        to="/courses/create"
        class="inline-flex items-center gap-3 bg-brand-yellow text-slate-900 px-8 py-4 rounded-2xl font-black shadow-[0_6px_0_0_#ca8a04] hover:shadow-none hover:translate-y-1 transition-all"
      >
        Создать курс 🛠️
      </NuxtLink>
    </div>
    <div class="w-48 h-48 relative z-10 shrink-0">
      <span class="text-[120px] filter drop-shadow-lg">✨</span>
    </div>
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
  </section>
</template>

<script setup lang="ts"></script>
