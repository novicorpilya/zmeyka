<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    <div
      v-for="stat in summaryStats"
      :key="stat.label"
      class="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-premium flex flex-col items-center text-center group hover:border-brand-blue transition-all"
    >
      <div
        class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
      >
        {{ stat.icon }}
      </div>
      <div class="text-3xl font-black text-slate-800">{{ stat.value }}</div>
      <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  stats: {
    totalCourses: number
    totalStudents: number
    pendingHomeworks: number
    activeToday: number
  }
}>()

const summaryStats = computed(() => [
  { label: 'Курсов', value: props.stats.totalCourses, icon: '🎓' },
  { label: 'Студентов', value: props.stats.totalStudents, icon: '👥' },
  { label: 'Проверить', value: props.stats.pendingHomeworks, icon: '⚖️' },
  { label: 'Активных', value: props.stats.activeToday, icon: '🔥' },
])
</script>
