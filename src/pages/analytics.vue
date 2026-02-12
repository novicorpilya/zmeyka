<template>
  <div class="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="space-y-2 text-center md:text-left px-2">
      <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
        {{ isTeacher ? 'Аналитика курсов 📈' : 'Мой прогресс 📈' }}
      </h1>
      <p class="text-base md:text-lg font-bold text-slate-400">
        {{
          isTeacher
            ? 'Следи за вовлеченностью и успехами твоих студентов'
            : 'Твои навыки растут не по дням, а по часам!'
        }}
      </p>
    </div>

    <!-- Teacher: Global Stats -->
    <TeacherGlobalStats v-if="isTeacher" :stats="teacherSummary" />

    <!-- Teacher: Augmented Review Center (Human-in-the-loop) -->
    <TeacherReviewCenter v-if="isTeacher" />

    <!-- Grid: Conditional Display -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
      <!-- Left Column: Primary Data -->
      <div class="lg:col-span-8 space-y-8 md:space-y-10">
        <!-- TEACHER: Detailed Course Performance (Heatmap) -->
        <TeacherCohortHeatmap
          v-if="isTeacher"
          v-model="selectedCohortId"
          :cohorts="teacherStore.cohorts"
          :analytics="teacherStore.activeCohortAnalytics"
        />

        <!-- STUDENT: Skill Grid -->
        <StudentSkillGrid v-else :skills="skills" />
      </div>

      <!-- Right Column: Secondary Data (Activity etc) -->
      <div class="lg:col-span-4 space-y-8 md:space-y-10">
        <AnalyticsActivityFeed :is-teacher="isTeacher" :events="recentEvents" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
})

import { useTeacherStore } from '~/entities/teacher/model/store'
import { useUserStore } from '~/entities/user/model/store'
import AnalyticsActivityFeed from '~/widgets/analytics/ui/AnalyticsActivityFeed.vue'
import StudentSkillGrid from '~/widgets/analytics/ui/StudentSkillGrid.vue'
import TeacherCohortHeatmap from '~/widgets/analytics/ui/TeacherCohortHeatmap.vue'
import TeacherGlobalStats from '~/widgets/analytics/ui/TeacherGlobalStats.vue'
import TeacherReviewCenter from '~/widgets/analytics/ui/TeacherReviewCenter.vue'

const userStore = useUserStore()
const teacherStore = useTeacherStore()

const isTeacher = computed(() => userStore.user?.role === 'TEACHER')
const selectedCohortId = ref('')

// Non-blocking client-side data fetch
useAsyncData(
  'analytics-dispatch',
  async () => {
    if (!userStore.isInitialized) {
      userStore.initStore()
    }
    if (isTeacher.value) {
      await Promise.all([teacherStore.fetchSummary(), teacherStore.fetchCohorts()])
    }
    return true
  },
  { lazy: true, server: false },
)

watch(selectedCohortId, (newId) => {
  if (newId) {
    teacherStore.fetchCohortAnalytics(newId)
  }
})

const recentEvents = computed(() => {
  return teacherStore.recentHomeworks.map((hw) => ({
    text: `${hw.studentName} сдал работу в «${hw.courseTitle}»`,
    time: new Date(hw.submittedAt).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))
})

const teacherSummary = computed(() => [
  { label: 'Всего студентов', value: teacherStore.stats.totalStudents || 0, icon: '👥' },
  { label: 'Сдано ДЗ (за неделю)', value: teacherStore.stats.homeworksThisWeek || 0, icon: '📝' },
  { label: 'Средний балл', value: (teacherStore.stats.averageScore || 0).toFixed(1), icon: '⭐' },
  {
    label: 'Успеваемость курса',
    value: `${teacherStore.stats.globalCompletionRate || 0}%`,
    icon: '🚀',
  },
])

const skills: Array<{
  name: string
  level: string
  progress: number
  icon: string
  borderColor: string
  barColor: string
}> = []
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
</style>
