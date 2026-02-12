<template>
  <div class="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
      <AppHeading level="h1" size="lg" center class="sm:text-left">
        {{ isTeacher ? 'Проверка работ ⚖️' : 'Мои домашки 📝' }}
      </AppHeading>

      <div
        class="px-4 py-2.5 md:px-6 md:py-3 bg-white rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-slate-500 shadow-sm text-center text-xs md:text-sm"
      >
        <template v-if="isTeacher">
          Нужно проверить:
          <span class="text-brand-orange font-black">{{
            teacherStore.stats.pendingHomeworks
          }}</span>
        </template>
        <template v-else>
          Осталось выполнить:
          <span class="text-brand-orange font-black">{{ studentPendingCount }}</span>
        </template>
      </div>
    </div>

    <!-- Role-based Content Wrapper -->
    <template v-if="isTeacher">
      <!-- Teacher: Section Tabs -->
      <div class="flex gap-4 px-2 overflow-x-auto pb-2 scrollbar-hide">
        <AppButton
          :variant="activeTab === 'grading' ? 'secondary' : 'outline'"
          size="md"
          @click="activeTab = 'grading'"
        >
          📝 Очередь ({{ teacherStore.stats.pendingHomeworks || 0 }})
        </AppButton>
        <AppButton
          :variant="activeTab === 'students' ? 'secondary' : 'outline'"
          size="md"
          @click="activeTab = 'students'"
        >
          👥 Ученики ({{ teacherStore.students.length || 0 }})
        </AppButton>
      </div>

      <!-- Teacher: Grading List (Tab) -->
      <ErrorBoundary v-if="activeTab === 'grading'">
        <TeacherHomeworkQueue
          :homeworks="teacherStore.recentHomeworks"
          :loading="teacherStore.isLoading"
        />
      </ErrorBoundary>

      <!-- Teacher: Students List (Tab) -->
      <TeacherStudentList
        v-if="activeTab === 'students'"
        :students="teacherStore.students"
        @create-chat="createChatAndRedirect"
      />
    </template>

    <!-- Student Case -->
    <ErrorBoundary v-else>
      <StudentHomeworkList :tasks="studentHomeworks" :loading="isLoadingStudent" />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useHomeworksApi } from '~/entities/homework/api'
import { useTeacherStore } from '~/entities/teacher/model/store'
import { useTasksData } from '~/features/homeworks/model/useTasksData'
import StudentHomeworkList from '~/features/homeworks/ui/StudentHomeworkList.vue'
import TeacherHomeworkQueue from '~/features/homeworks/ui/TeacherHomeworkQueue.vue'
import TeacherStudentList from '~/features/homeworks/ui/TeacherStudentList.vue'
import { useHomeworkNotifications } from '~/shared/composables/useHomeworkNotifications'
import AppButton from '~/shared/ui/AppButton.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import ErrorBoundary from '~/shared/ui/ErrorBoundary.vue'

const teacherStore = useTeacherStore()
const homeworksApi = useHomeworksApi()
const router = useRouter()

const {
  isTeacher,
  studentHomeworks,
  isLoadingStudent,
  studentPendingCount,
  fetchStudentHomeworks,
  refreshTeacherSummary,
} = useTasksData()

const activeTab = ref<'grading' | 'students'>('grading')

// Setup real-time notifications via composable
useHomeworkNotifications({
  isTeacher: isTeacher.value,
  onRefreshTeacher: refreshTeacherSummary,
  onRefreshStudent: fetchStudentHomeworks,
})

const createChatAndRedirect = async (studentId: string) => {
  try {
    const { homeworkId } = await homeworksApi.ensureChat(studentId)
    router.push(`/homework/${homeworkId}`)
  } catch (err) {
    console.error('Failed to create/get chat', err)
  }
}

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
})
</script>

<style scoped>
/* Redundant styles removed - now handled by global index.css */
</style>
