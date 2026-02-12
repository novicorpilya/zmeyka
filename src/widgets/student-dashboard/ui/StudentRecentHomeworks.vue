<template>
  <div class="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Последние домашки</h3>
      <NuxtLink
        to="/tasks"
        class="text-[10px] font-black text-brand-blue hover:text-brand-blue/80 uppercase tracking-widest transition-colors"
      >
        Все работы ⮕
      </NuxtLink>
    </div>

    <div v-if="homeworks.length" class="space-y-4">
      <div
        v-for="hw in recentHomeworks"
        :key="hw.id"
        class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center gap-4 group hover:border-brand-blue transition-all"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          :class="{
            'bg-brand-green/10': hw.status === 'COMPLETED',
            'bg-rose-100/50': hw.status === 'REJECTED',
            'bg-amber-100/50':
              hw.status === 'PENDING' ||
              hw.status === 'NEEDS_REVIEW' ||
              hw.status === 'CHECKING' ||
              hw.status === 'NOT_STARTED',
          }"
        >
          {{ hw.status === 'COMPLETED' ? '✅' : hw.status === 'REJECTED' ? '❌' : '⏳' }}
        </div>
        <div class="flex-grow min-w-0">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
            {{ hw.course?.title || hw.courseTitle || 'Курс' }}
          </p>
          <h4 class="font-black text-slate-800 text-sm truncate">
            {{ hw.lesson?.title || 'Урок' }}
          </h4>
        </div>
        <NuxtLink
          :to="`/homework/${hw.id}`"
          class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs hover:bg-brand-blue hover:text-white transition-all shadow-sm"
        >
          💬
        </NuxtLink>
      </div>
    </div>

    <div v-else class="py-10 text-center space-y-4">
      <div class="text-4xl">🌵</div>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Тут пока пусто...</p>
      <NuxtLink
        to="/courses"
        class="inline-block px-6 py-3 bg-brand-green text-white rounded-xl font-black text-[10px] uppercase shadow-cartoon-sm"
      >
        Начать учиться
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Homework } from '~/shared/types'

const props = defineProps<{
  homeworks: Homework[]
}>()

const recentHomeworks = computed(() => {
  return [...props.homeworks]
    .sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.updatedAt || '').getTime()
      const dateB = new Date(b.submittedAt || b.updatedAt || '').getTime()
      return dateB - dateA
    })
    .slice(0, 3)
})
</script>

<style scoped>
.shadow-cartoon-sm {
  box-shadow: 0 4px 0 0 #166534;
}
</style>
