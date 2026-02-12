import { defineStore } from 'pinia'

import { useTeacherApi } from '~/entities/teacher/api'
import type { TeacherDashboardSummary, Cohort, AnalyticsItem } from '~/shared/types'

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    stats: {
      totalCourses: 0,
      totalStudents: 0,
      pendingHomeworks: 0,
      activeToday: 0,
      homeworksThisWeek: 0,
      averageScore: 0,
      globalCompletionRate: 0,
    },
    recentHomeworks: [] as TeacherDashboardSummary['recentHomeworks'],
    coursesPerformance: [] as TeacherDashboardSummary['coursesPerformance'],
    students: [] as TeacherDashboardSummary['students'],
    cohorts: [] as Cohort[],
    activeCohortAnalytics: [] as AnalyticsItem[],
    isLoading: true,
    error: null as string | null,
    isInitialized: false,
  }),

  actions: {
    async fetchSummary() {
      const { getSummary } = useTeacherApi()
      this.error = null

      try {
        const data = (await getSummary()) as TeacherDashboardSummary
        this.stats = data.stats
        this.recentHomeworks = data.recentHomeworks
        this.coursesPerformance = data.coursesPerformance
        this.students = data.students
        this.isInitialized = true
      } catch (err: unknown) {
        const errorData = err as { message?: string }
        this.error = errorData.message || 'Ошибка загрузки данных учителя'
      } finally {
        this.isLoading = false
        this.isInitialized = true
      }
    },

    async fetchCohorts() {
      const { getCohorts } = useTeacherApi()
      try {
        this.cohorts = await getCohorts()
      } catch (err) {
        console.error('Failed to fetch cohorts', err)
      }
    },

    async fetchCohortAnalytics(cohortId: string) {
      const { getCohortAnalytics } = useTeacherApi()
      try {
        this.activeCohortAnalytics = await getCohortAnalytics(cohortId)
      } catch (err) {
        console.error('Failed to fetch cohort analytics', err)
      }
    },
  },
})
