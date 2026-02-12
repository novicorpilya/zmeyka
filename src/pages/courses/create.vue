<template>
  <div
    class="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 md:p-6 relative"
  >
    <!-- Ambient Background Elements -->
    <div
      class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse"
    ></div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[120px] animate-pulse"
    ></div>

    <div class="w-full max-w-4xl relative z-10 space-y-8 md:space-y-12 pb-10 md:pb-20">
      <!-- High-End Header -->
      <div class="text-center space-y-4 md:space-y-6">
        <NuxtLink
          to="/courses"
          class="inline-flex items-center gap-3 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
        >
          ⬅️ Назад в лощину
        </NuxtLink>
        <div class="space-y-1 md:space-y-2">
          <h1
            class="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none"
          >
            Новая <span class="text-brand-green">Глава</span>
          </h1>
          <p class="text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px] md:text-xs">
            Проектируем будущее ИИ-образования
          </p>
        </div>
      </div>

      <!-- The Creation Pod -->
      <div
        class="bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[4rem] border border-white/10 p-1 md:p-2 shadow-2xl"
      >
        <div class="bg-white rounded-[1.8rem] md:rounded-[3.8rem] overflow-hidden">
          <CourseForm />
        </div>
      </div>

      <!-- Social Proof / Footer inside Create -->
      <div class="flex justify-center gap-12 opacity-30 select-none grayscale">
        <div v-for="i in 3" :key="i" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-slate-800"></div>
          <div class="h-2 w-16 bg-slate-800 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CourseForm from '@/features/course-builder/ui/CourseForm.vue'

definePageMeta({
  layout: false, // Custom high-end layout
  middleware: ['auth'],
})
</script>

<style scoped>
.shadow-2xl {
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
}
</style>
