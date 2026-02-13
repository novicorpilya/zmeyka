import { defineStore } from 'pinia'

import { useDashboardApi } from '@entities/dashboard/api'
import { useHomeworksApi } from '@entities/homework/api'
import type { DashboardSummary, Homework } from '@shared/types'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      xp: 0,
      level: 1,
      streak: 0,
      completedCourses: 0,
      completedLessons: 0,
    },
    activeCourses: [] as DashboardSummary['activeCourses'],
    recentActivity: [] as DashboardSummary['recentActivity'],
    homeworks: [] as Homework[],
    loading: true,
    error: null as string | null,
    isInitialized: false,
  }),

  actions: {
    async fetchSummary() {
      this.error = null

      try {
        const { getSummary } = useDashboardApi()
        const data = (await getSummary()) as DashboardSummary

        this.stats = data.stats
        this.activeCourses = data.activeCourses
        this.recentActivity = data.recentActivity

        this.isInitialized = true
      } catch (err: unknown) {
        const apiErr = err as { data?: { message?: string }; message?: string }
        this.error = apiErr.data?.message || apiErr.message || 'Ошибка загрузки дашборда'
      } finally {
        this.loading = false
        this.isInitialized = true
      }
    },
    async fetchHomeworks() {
      try {
        const { getUserHomeworks } = useHomeworksApi()
        this.homeworks = await getUserHomeworks()
      } catch {
        // Silent
      }
    },
  },
})
