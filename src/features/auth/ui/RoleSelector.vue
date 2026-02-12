<template>
  <div class="space-y-10 animate-in fade-in zoom-in duration-500">
    <div class="text-center space-y-3 md:space-y-4">
      <h1 class="text-2xl xs:text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
        Выбери свой путь 🗺️
      </h1>
      <p class="text-slate-400 font-bold text-base md:text-lg">Кто ты в мире Змейки?</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Student Card -->
      <button
        @click="$emit('select', 'STUDENT')"
        class="group bg-white p-6 xs:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon hover:border-brand-green hover:-translate-y-2 transition-all text-left space-y-4 md:space-y-6 relative overflow-hidden"
      >
        <div
          class="w-12 h-12 md:w-20 md:h-20 bg-brand-green/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-5xl group-hover:scale-110 transition-transform"
        >
          🐍
        </div>
        <div class="space-y-1 md:space-y-2">
          <h3 class="text-xl md:text-2xl font-black text-slate-800">Ученик</h3>
          <p class="font-bold text-slate-400 text-sm md:text-base leading-snug">
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
        @click="$emit('select', 'TEACHER')"
        class="group bg-white p-6 xs:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon hover:border-brand-blue hover:-translate-y-2 transition-all text-left space-y-4 md:space-y-6 relative overflow-hidden"
      >
        <div
          class="w-12 h-12 md:w-20 md:h-20 bg-brand-blue/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-5xl group-hover:scale-110 transition-transform"
        >
          👨‍🏫
        </div>
        <div class="space-y-1 md:space-y-2">
          <h3 class="text-xl md:text-2xl font-black text-slate-800">Учитель</h3>
          <p class="font-bold text-slate-400 text-sm md:text-base leading-snug">
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
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'select', role: 'STUDENT' | 'TEACHER'): void
}>()
</script>
