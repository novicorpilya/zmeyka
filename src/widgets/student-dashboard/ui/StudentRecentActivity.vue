<template>
  <div class="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon space-y-6">
    <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
      ⚡ Активность
    </h3>

    <div v-if="activities.length" class="space-y-4">
      <div
        v-for="activity in displayActivities"
        :key="activity.id"
        class="flex items-center gap-4 group"
      >
        <div class="flex flex-col items-center">
          <div class="w-2 h-2 rounded-full bg-brand-green"></div>
          <div class="w-0.5 h-10 bg-slate-100 last:hidden"></div>
        </div>
        <div class="flex-grow pb-4 border-b border-slate-50 last:border-0 last:pb-0">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-black text-slate-700">{{ activity.title }}</p>
              <p class="text-[10px] font-bold text-slate-400">{{ activity.formattedDate }}</p>
            </div>
            <div
              class="px-2 py-1 bg-brand-green/10 rounded-lg text-brand-green font-black text-[10px]"
            >
              +{{ activity.points }} XP
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="py-10 text-center">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Начни учиться, чтобы увидеть историю! 🚀
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  activities: Array<{
    id: string
    date: string | Date
    points: number
    type: string
  }>
}>()

const displayActivities = computed(() => {
  return [...props.activities]
    .map((a) => ({
      ...a,
      title:
        a.type === 'XP_GAIN'
          ? 'Получены очки опыта'
          : a.type === 'LEVEL_UP'
            ? 'Новый уровень! ✨'
            : a.type === 'LESSON_COMPLETED'
              ? 'Урок завершен ✅'
              : 'Активность',
      formattedDate: new Date(a.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})
</script>
