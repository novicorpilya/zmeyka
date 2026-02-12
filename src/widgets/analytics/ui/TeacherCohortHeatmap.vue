<template>
  <div
    class="bg-white p-8 md:p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight text-center">
        Горнила Потоков (Analytics) 🔥
      </h3>
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-600 outline-none focus:border-brand-blue transition-all"
      >
        <option value="" disabled>Выберите поток</option>
        <option v-for="cohort in cohorts" :key="cohort.id" :value="cohort.id">
          {{ cohort.name }} ({{ cohort.course.title }})
        </option>
      </select>
    </div>

    <!-- Heatmap View -->
    <div v-if="modelValue" class="space-y-6">
      <div v-if="analytics.length === 0" class="text-center py-10 opacity-30">
        <div class="text-4xl">🌵</div>
        <p class="font-black uppercase tracking-widest mt-2">Нет данных для этого потока</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="(item, index) in analytics"
          :key="item.lessonId"
          class="relative h-16 bg-slate-50 rounded-2xl overflow-hidden group border-2 border-transparent hover:border-brand-blue/20 transition-all"
        >
          <!-- Fill percentage -->
          <div
            class="absolute inset-0 bg-brand-blue/10 transition-all duration-1000"
            :style="{ width: item.completionRate + '%' }"
          ></div>
          <!-- Drop-off indicator (red end) -->
          <div
            v-if="index > 0 && item.completionRate < analytics[index - 1].completionRate"
            class="absolute right-0 top-0 bottom-0 w-1 bg-red-400 opacity-50"
          ></div>

          <div class="relative z-10 h-full flex items-center justify-between px-6">
            <div class="flex items-center gap-4">
              <span
                class="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-xs text-slate-400"
              >
                {{ index + 1 }}
              </span>
              <span class="font-black text-slate-700 uppercase tracking-tight">{{
                item.lessonTitle
              }}</span>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Прошли</p>
              <p class="text-xl font-black text-brand-blue leading-none">
                {{ item.completedCount }}
                <span class="text-xs opacity-50">/ {{ item.totalStudents }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20 opacity-30">
      <div class="text-6xl mb-4">📊</div>
      <p class="font-black uppercase tracking-widest">Выберите поток для анализа воронки</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Cohort {
  id: string
  name: string
  course: { title: string }
}

interface AnalyticsItem {
  lessonId: string
  lessonTitle: string
  completionRate: number
  completedCount: number
  totalStudents: number
}

defineProps<{
  modelValue: string
  cohorts: Cohort[]
  analytics: AnalyticsItem[]
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
</style>
