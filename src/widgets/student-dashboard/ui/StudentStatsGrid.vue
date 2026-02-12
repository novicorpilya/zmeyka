<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
    <div
      v-for="stat in displayStats"
      :key="stat.label"
      class="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-4 border-slate-100 shadow-premium flex flex-col items-center gap-1 sm:gap-2 group hover:-translate-y-1 transition-all"
    >
      <span class="text-2xl sm:text-3xl group-hover:scale-125 transition-transform">
        {{ stat.icon }}
      </span>
      <div class="text-xl sm:text-2xl font-black text-slate-800">{{ stat.value }}</div>
      <div
        class="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center"
      >
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  stats: {
    xp: number
    completedCourses: number
    completedLessons: number
    streak: number
  }
}>()

const formatValue = (val: number) => {
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
  return val
}

const displayStats = computed(() => [
  { label: 'Опыт', value: formatValue(props.stats.xp), icon: '✨' },
  { label: 'Завершено', value: props.stats.completedCourses, icon: '🎓' },
  { label: 'Уроки', value: props.stats.completedLessons, icon: '💎' },
  { label: 'Ударно', value: props.stats.streak, icon: '🔥' },
])
</script>
