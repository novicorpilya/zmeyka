import { defineStore } from 'pinia'

// eslint-disable-next-line boundaries/element-types
import { useDashboardApi } from '~/features/dashboard/api'
import type { DashboardSummary } from '~/shared/types'

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
    loading: false,
    error: null as string | null,
    isInitialized: false,
  }),

  actions: {
    async fetchSummary() {
      this.loading = true
      this.error = null

      try {
        const { getSummary } = useDashboardApi()
        const data = (await getSummary()) as DashboardSummary

        this.stats = data.stats
        this.activeCourses = data.activeCourses
        this.recentActivity = data.recentActivity

        this.isInitialized = true
      } catch (err: unknown) {
        const errorData = err as { data?: { message?: string } }
        this.error = errorData.data?.message || 'Ошибка загрузки дашборда'
      } finally {
        this.loading = false
      }
    },
  },
})
