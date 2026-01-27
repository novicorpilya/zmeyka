<template>
  <div class="min-h-screen py-20 px-6">
    <div class="max-w-7xl mx-auto space-y-12">
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 bg-brand-green/10 rounded-3xl flex items-center justify-center text-5xl">🎓</div>
          <div class="space-y-1">
            <h1 class="text-4xl font-black text-slate-800 tracking-tight">Моё обучение</h1>
            <p class="text-xl font-bold text-slate-400">Растим навыки вместе со Змейкой!</p>
          </div>
        </div>
        <NuxtLink 
          to="/course/create" 
          class="bg-brand-blue px-8 py-4 rounded-2xl font-black text-white shadow-[0_6px_0_0_#1e40af] hover:translate-y-0.5 hover:shadow-[0_4px_0_0_#1e40af] transition-all btn-bouncy"
        >
          Создать новый курс
        </NuxtLink>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center text-2xl">🔥</div>
          <div>
            <div class="text-2xl font-black text-slate-800">5</div>
            <div class="text-sm font-bold text-slate-400">Дней подряд</div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-brand-green/20 rounded-2xl flex items-center justify-center text-2xl">🏆</div>
          <div>
            <div class="text-2xl font-black text-slate-800">{{ courses?.length || 0 }}</div>
            <div class="text-sm font-bold text-slate-400">Курсов пройдено</div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-brand-blue/20 rounded-2xl flex items-center justify-center text-2xl">✨</div>
          <div>
            <div class="text-2xl font-black text-slate-800">120</div>
            <div class="text-sm font-bold text-slate-400">Очков опыта</div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-brand-orange/20 rounded-2xl flex items-center justify-center text-2xl">🏅</div>
          <div>
            <div class="text-2xl font-black text-slate-800">3</div>
            <div class="text-sm font-bold text-slate-400">Достижения</div>
          </div>
        </div>
      </div>

      <!-- Courses List -->
      <div class="space-y-8">
        <h2 class="text-3xl font-black text-slate-800 flex items-center gap-3">
          📚 Доступные приключения
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-if="pending" class="col-span-full py-20 text-center space-y-4">
            <div class="text-5xl animate-bounce">⏳</div>
            <div class="text-xl font-bold text-slate-400 tracking-widest uppercase">Змейка ищет курсы...</div>
          </div>
          
          <div v-else-if="!courses?.length" class="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 space-y-6">
            <div class="text-6xl">😴</div>
            <p class="text-2xl font-black text-slate-400">Пока тут пусто.. Самое время создать первый курс!</p>
            <NuxtLink to="/course/create" class="inline-block text-brand-green font-black underline decoration-4 underline-offset-8">Создать приключение →</NuxtLink>
          </div>

          <div 
            v-for="course in courses" 
            :key="course.id"
            class="bg-white p-2 rounded-[3rem] border-4 border-slate-100 hover:border-brand-green hover:shadow-[0_15px_0_0_#dcfce7] transition-all group overflow-hidden"
          >
            <div class="p-8 space-y-6">
              <div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">📗</div>
              <div class="space-y-2">
                <h3 class="text-2xl font-black text-slate-800 group-hover:text-brand-green transition-colors line-clamp-2">
                  {{ course.title }}
                </h3>
                <p class="font-bold text-slate-400 line-clamp-2">{{ course.description }}</p>
              </div>
              
              <div class="pt-4 flex items-center justify-between border-t-4 border-slate-50">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm">👨‍🏫</div>
                  <span class="text-sm font-black text-slate-400 uppercase tracking-wider">{{ course.teacher?.name || 'Аноним' }}</span>
                </div>
                <NuxtLink 
                  :to="`/course/${course.id}`" 
                  class="bg-brand-orange text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_#9a3412] active:translate-y-1 active:shadow-none transition-all"
                >
                  🚀
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseApi } from '@entities/course/api'
import type { Course } from '@shared/types'

const { getCourses } = useCourseApi()
const { data: courses, pending } = await useAsyncData<Course[]>('courses', () => getCourses() as Promise<Course[]>)
</script>
