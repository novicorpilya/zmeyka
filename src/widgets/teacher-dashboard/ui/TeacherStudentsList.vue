<template>
  <section
    class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8 h-full"
  >
    <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Мои ученики</h3>
    <div class="space-y-6">
      <div
        v-for="student in students"
        :key="student.id"
        class="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group"
      >
        <div
          class="w-12 h-12 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform"
        >
          {{ student.avatar || '🐍' }}
        </div>
        <div class="min-w-0 flex-grow">
          <p class="font-black text-slate-800 text-sm truncate uppercase tracking-tight">
            {{ student.name }}
          </p>
          <p class="text-[10px] font-bold text-slate-400 truncate">{{ student.email }}</p>
        </div>
        <div class="text-right flex flex-col items-end gap-1">
          <p class="text-[10px] font-black text-brand-blue uppercase tracking-widest">
            {{ student.homeworksCount }} ДЗ
          </p>
          <NuxtLink
            v-if="student.lastHomeworkId"
            :to="`/homework/${student.lastHomeworkId}`"
            class="text-[9px] font-black text-white bg-brand-blue px-2 py-1 rounded-lg hover:scale-105 transition-transform flex items-center gap-1"
          >
            💬 ЧАТ
          </NuxtLink>
          <span
            v-else
            class="text-[8px] font-black text-slate-300 uppercase italic"
            title="Чат доступен после первой сданной домашки"
          >
            Ждем ДЗ
          </span>
        </div>
      </div>

      <div v-if="!students?.length" class="text-center py-8 text-slate-400 font-bold">
        Учеников пока нет... 😢
      </div>
    </div>
    <NuxtLink
      to="/courses"
      class="block text-center text-[10px] font-black text-slate-400 hover:text-brand-blue uppercase tracking-widest transition-colors pt-4 border-t-2 border-slate-50"
    >
      Перейти в мастерскую курсов →
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import type { TeacherDashboardSummary } from '@entities/teacher/model/types'

defineProps<{
  students: TeacherDashboardSummary['students']
}>()
</script>
