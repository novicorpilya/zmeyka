<template>
  <div>
    <!-- Show Dashboard content only after auth & initial data fetch -->
    <div v-if="userStore.isAuthenticated && !pending" class="animate-in fade-in duration-700">
      <!-- Component Switching based on Role -->
      <TeacherDashboard v-if="userStore.user?.role === 'TEACHER'" />
      <StudentDashboard v-else />
    </div>

    <!-- Full-page Loading State to prevent Flash -->
    <div v-else class="fixed inset-0 bg-slate-50 flex items-center justify-center z-[100]">
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">
          Синхронизация прогресса...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '~/entities/dashboard/model/store'
import { useTeacherStore } from '~/entities/teacher/model/store'
import { useUserStore } from '~/entities/user/model/store'
import StudentDashboard from '~/features/dashboard/ui/StudentDashboard.vue'
import TeacherDashboard from '~/features/dashboard/ui/TeacherDashboard.vue'

const userStore = useUserStore()
const studentStore = useDashboardStore()
const teacherStore = useTeacherStore()

// Blocking SSR data fetch
const { pending } = await useAsyncData('dashboard-dispatch', async () => {
  if (userStore.user?.role === 'TEACHER') {
    await teacherStore.fetchSummary()
  } else {
    await studentStore.fetchSummary()
  }
  return true
})

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
})
</script>

<style scoped>
/* Page-level styles can go here if needed */
</style>
