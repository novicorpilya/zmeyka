<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between px-2">
      <h2
        class="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3"
      >
        📚 Обучение
      </h2>
      <NuxtLink
        to="/courses"
        class="text-xs sm:text-sm font-black text-brand-blue hover:underline uppercase tracking-wider"
      >
        Все →
      </NuxtLink>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
      <template v-if="courses?.length">
        <div
          v-for="course in courses"
          :key="course.id"
          class="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon hover:border-brand-green transition-all group overflow-hidden relative"
        >
          <div class="space-y-5 sm:space-y-6 relative z-10">
            <div class="flex items-start justify-between">
              <div
                class="w-12 h-12 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform"
              >
                🐍
              </div>
            </div>
            <div class="space-y-1">
              <h3 class="text-xl sm:text-2xl font-black text-slate-800 line-clamp-1 leading-tight">
                {{ course.title }}
              </h3>
              <p class="font-bold text-slate-400 text-[10px] sm:text-sm line-clamp-1 italic">
                с Мастером {{ course.teacherName }}
              </p>
            </div>
            <div class="space-y-2.5">
              <div
                class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                <span>Прогресс</span>
                <span class="text-brand-green">{{ course.progress }}%</span>
              </div>
              <div class="h-3 bg-slate-100 rounded-full p-0.5">
                <div
                  class="h-full bg-brand-green rounded-full shadow-[0_0_8px_oklch(65%_0.15_160)] transition-all duration-1000"
                  :style="{ width: `${course.progress}%` }"
                ></div>
              </div>
            </div>
            <NuxtLink
              :to="`/courses/${course.id}`"
              class="w-full bg-slate-900 py-3.5 sm:py-4 rounded-xl font-black text-white text-xs sm:text-sm shadow-[0_5px_0_0_#1e293b] hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Ворваться в урок
            </NuxtLink>
          </div>
        </div>
      </template>
      <div
        v-else
        class="col-span-full p-8 sm:p-12 text-center bg-white rounded-[2rem] sm:rounded-[2.5rem] border-4 border-dashed border-slate-100 space-y-4"
      >
        <div class="text-4xl sm:text-5xl">🥚</div>
        <p class="text-lg sm:text-xl font-black text-slate-400">
          Тут пока пусто.. Давай вылупим твой первый курс!
        </p>
        <NuxtLink
          to="/courses"
          class="text-brand-green font-black underline decoration-2 underline-offset-4"
        >
          Каталог →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardSummary } from '~/shared/types'

defineProps<{
  courses: DashboardSummary['activeCourses']
}>()
</script>
