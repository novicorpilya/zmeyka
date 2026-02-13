<template>
  <div>
    <!-- Show Dashboard content only after auth & initial data fetch -->
    <!-- Show Dashboard content if authenticated and we either have data or it's loading in background -->
    <div
      v-if="userStore.isAuthenticated && isInitialDataLoaded"
      class="animate-in fade-in duration-700"
    >
      <!-- UI Dashboard content -->
      <TeacherDashboard v-if="userStore.user?.role === 'TEACHER'" />
      <StudentDashboard v-else />
    </div>

    <!-- Loading State -->
    <div v-else class="min-h-[60vh] flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">
          Запуск системы...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '@entities/dashboard/model/store'
import { useTeacherStore } from '@entities/teacher/model/store'
import { useUserStore } from '@entities/user/model/store'

import StudentDashboard from './dashboard/ui/StudentDashboard.vue'
import TeacherDashboard from './dashboard/ui/TeacherDashboard.vue'

const userStore = useUserStore()
const studentStore = useDashboardStore()
const teacherStore = useTeacherStore()

const isTeacher = computed(() => userStore.user?.role === 'TEACHER')

const isInitialDataLoaded = computed(() => {
  if (isTeacher.value) return teacherStore.isInitialized
  return studentStore.isInitialized
})

// Non-blocking client-side data fetch
useAsyncData(
  'dashboard-dispatch',
  async () => {
    // If still no user, don't attempt to fetch
    if (!userStore.user) return false

    // Avoid double fetching if already has data
    if (isTeacher.value) {
      if (teacherStore.stats.totalCourses > 0 && teacherStore.isInitialized) return true
      await teacherStore.fetchSummary()
    } else {
      if (studentStore.stats.xp > 0 && studentStore.isInitialized) return true
      await studentStore.fetchSummary()
      // Also fetch homeworks to show status on dashboard
      await studentStore.fetchHomeworks()
    }
    return true
  },
  { lazy: true, server: false },
)

definePageMeta({
  layout: 'main',
  middleware: ['auth'],
})
</script>
