<template>
  <section class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8">
    <div class="flex items-center justify-between">
      <h3
        class="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3"
      >
        📝 Очередь проверки
        <span
          v-if="pendingCount > 0"
          class="bg-brand-orange text-white text-[10px] px-2 py-1 rounded-lg animate-pulse"
        >
          {{ pendingCount }} NEW
        </span>
      </h3>
    </div>

    <div v-if="homeworks?.length" class="space-y-4">
      <div
        v-for="hw in homeworks"
        :key="hw.id"
        class="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-brand-green transition-all group cursor-pointer"
      >
        <div
          class="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-xl shrink-0"
        >
          👤
        </div>
        <div class="flex-grow min-w-0">
          <p class="font-black text-slate-800 truncate">{{ hw.studentName }}</p>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {{ hw.courseTitle }}
          </p>
        </div>
        <NuxtLink
          v-if="hw.commentsCount > 0"
          :to="`/homework/${hw.id}`"
          class="flex items-center gap-1 bg-brand-blue text-white px-3 py-1.5 rounded-xl hover:scale-105 transition-all shadow-sm"
        >
          <span class="text-xs">💬</span>
          <span class="text-[10px] font-black uppercase tracking-tight"
            >ЧАТ ({{ hw.commentsCount }})</span
          >
        </NuxtLink>
        <div class="text-right shrink-0">
          <p class="text-[10px] font-black text-slate-400 capitalize mb-1">
            {{ formatDate(hw.submittedAt) }}
          </p>
          <NuxtLink
            :to="`/homework/${hw.id}`"
            class="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-black text-[10px] text-brand-green hover:bg-brand-green hover:text-white hover:border-brand-green transition-all inline-block"
          >
            ПРОВЕРИТЬ
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12 text-slate-400 font-bold">
      В очереди пусто! Можно отдохнуть или создать новый урок 🌴
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TeacherDashboardSummary } from '@entities/teacher/model/types'

defineProps<{
  homeworks: TeacherDashboardSummary['recentHomeworks']
  pendingCount: number
}>()

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
