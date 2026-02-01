import { defineStore } from 'pinia'

// eslint-disable-next-line boundaries/element-types
import { useTeacherApi } from '~/features/teacher/api'
import type { TeacherDashboardSummary } from '~/shared/types'

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    stats: {
      totalCourses: 0,
      totalStudents: 0,
      pendingHomeworks: 0,
      activeToday: 0,
    },
    recentHomeworks: [] as TeacherDashboardSummary['recentHomeworks'],
    coursesPerformance: [] as TeacherDashboardSummary['coursesPerformance'],
    students: [] as TeacherDashboardSummary['students'],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchSummary() {
      const { getSummary } = useTeacherApi()
      this.isLoading = true
      this.error = null

      try {
        const data = (await getSummary()) as TeacherDashboardSummary
        this.stats = data.stats
        this.recentHomeworks = data.recentHomeworks
        this.coursesPerformance = data.coursesPerformance
        this.students = data.students
      } catch (err: unknown) {
        const errorData = err as { message?: string }
        this.error = errorData.message || 'Ошибка загрузки данных учителя'
      } finally {
        this.isLoading = false
      }
    },
  },
})
