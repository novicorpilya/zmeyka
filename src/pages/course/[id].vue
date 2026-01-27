<template>
  <div class="min-h-screen py-20 px-6">
    <div v-if="pending" class="text-center py-20 animate-bounce text-6xl">⏳</div>
    
    <div v-else-if="course" class="max-w-5xl mx-auto space-y-12">
      <NuxtLink to="/dashboard" class="inline-flex items-center gap-2 font-black text-brand-green uppercase tracking-widest hover:translate-x-[-5px] transition-transform">
        ← Назад к курсам
      </NuxtLink>

      <div class="flex flex-col md:flex-row gap-12 items-start">
        <div class="flex-grow space-y-8">
          <div class="space-y-4">
            <h1 class="text-5xl font-black text-slate-800 leading-tight">{{ course.title }}</h1>
            <div class="flex items-center gap-4">
              <div class="px-6 py-2 bg-brand-yellow/20 text-slate-700 rounded-full font-black text-sm uppercase tracking-widest">
                👨‍🏫 Учитель: {{ course.teacher?.name || 'Мастер Змейка' }}
              </div>
            </div>
          </div>

          <div class="aspect-video bg-slate-900 rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden relative group">
             <div class="absolute inset-0 bg-brand-green/10 flex items-center justify-center">
                <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-cartoon group-hover:scale-110 transition-transform cursor-pointer">▶️</div>
             </div>
             <p class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-bold uppercase tracking-widest text-xs">Плеер Змейка v1.0</p>
          </div>

          <div class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-6">
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Об этом приключении</h2>
            <p class="text-xl font-bold text-slate-500 leading-relaxed">{{ course.description }}</p>
          </div>
        </div>

        <aside class="w-full md:w-80 space-y-8">
          <!-- AI Assistant Card -->
          <div class="p-8 bg-brand-green rounded-[3rem] shadow-[0_12px_0_0_#166534] space-y-6 text-white text-center relative overflow-hidden">
            <div class="relative z-10 space-y-4">
              <div class="text-5xl">✨</div>
              <h3 class="text-xl font-black uppercase tracking-tight">AI Помощник</h3>
              <p class="font-bold text-white/80 leading-snug">Готов проверить твою домашку прямо сейчас!</p>
              <button class="w-full py-4 bg-white text-brand-green rounded-2xl font-black shadow-[0_6px_0_0_#e2e8f0] hover:translate-y-0.5 hover:shadow-[0_4px_0_0_#e2e8f0] transition-all btn-bouncy">
                Сдать работу
              </button>
            </div>
            <!-- Background circle -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          </div>

          <!-- Progress Card -->
          <div class="p-8 bg-white rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-4">
            <h4 class="font-black text-slate-800 uppercase tracking-widest text-center text-sm">Прогресс</h4>
            <div class="h-6 bg-slate-100 rounded-full overflow-hidden p-1">
              <div class="h-full bg-brand-yellow rounded-full w-1/3 shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]"></div>
            </div>
            <p class="text-center font-black text-slate-400 text-xs tracking-widest uppercase">Урок 1 из 3</p>
          </div>
        </aside>
      </div>
    </div>

    <div v-else class="text-center py-20 space-y-8">
      <div class="text-8xl">🙈</div>
      <h1 class="text-3xl font-black text-slate-800">Курс потерялся в траве...</h1>
      <NuxtLink to="/dashboard" class="bg-brand-green px-10 py-5 rounded-2xl font-black text-white shadow-cartoon inline-block">Вернуться ко всем курсам</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseApi } from '@entities/course/api'
import type { Course } from '@shared/types'

const route = useRoute()
const { getCourse } = useCourseApi()

const { data: course, pending } = await useAsyncData<Course>(`course-${route.params.id}`, () => 
  getCourse(route.params.id as string) as Promise<Course>
)
</script>
