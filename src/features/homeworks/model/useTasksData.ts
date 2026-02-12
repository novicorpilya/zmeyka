import { computed, ref } from 'vue'

import { useHomeworksApi } from '~/entities/homework/api'
import { useTeacherStore } from '~/entities/teacher/model/store'
import { useUserStore } from '~/entities/user/model/store'
import type { Homework } from '~/shared/types'

export const useTasksData = () => {
  const userStore = useUserStore()
  const teacherStore = useTeacherStore()
  const homeworksApi = useHomeworksApi()

  const isTeacher = computed(() => ['TEACHER', 'ADMIN'].includes(userStore.user?.role as string))
  const studentHomeworks = useState<Homework[]>('student-homeworks', () => [])
  const isLoadingStudent = ref(false)

  const studentPendingCount = computed(() => {
    return studentHomeworks.value.filter((h: Homework) => h.status !== 'COMPLETED').length
  })

  const fetchStudentHomeworks = async () => {
    isLoadingStudent.value = true
    try {
      const data = await homeworksApi.getUserHomeworks()
      studentHomeworks.value = data
    } catch (err) {
      console.error('Failed to fetch student homeworks', err)
    } finally {
      isLoadingStudent.value = false
    }
  }

  const { refresh: refreshTeacherSummary, pending: isSummaryLoading } = useAsyncData(
    'tasks-data',
    async () => {
      if (!userStore.user) return null
      try {
        if (isTeacher.value) {
          await teacherStore.fetchSummary()
        }
      } catch (e) {
        console.error('[Tasks] Data Fetch error:', e)
      }
      return true
    },
    { lazy: true, server: false, watch: [() => userStore.user?.role] },
  )

  return {
    isTeacher,
    studentHomeworks,
    isLoadingStudent,
    studentPendingCount,
    isSummaryLoading,
    fetchStudentHomeworks,
    refreshTeacherSummary,
  }
}
