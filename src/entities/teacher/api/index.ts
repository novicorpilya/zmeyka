import { useApi } from '~/shared/api'
import type { TeacherDashboardSummary, TeacherProfile, Cohort, AnalyticsItem } from '~/shared/types'

export const useTeacherApi = () => {
  const api = useApi()

  const getSummary = async (): Promise<TeacherDashboardSummary> => {
    return await api<TeacherDashboardSummary>('/teacher/dashboard/summary')
  }

  const getCohorts = async (): Promise<Cohort[]> => {
    return await api<Cohort[]>('/cohorts')
  }

  const getCohortAnalytics = async (cohortId: string): Promise<AnalyticsItem[]> => {
    return await api<AnalyticsItem[]>(`/cohorts/${cohortId}/analytics`)
  }

  const getProfile = async (): Promise<TeacherProfile> => {
    return await api<TeacherProfile>('/teacher/profile')
  }

  const updateProfile = async (data: Partial<TeacherProfile>): Promise<TeacherProfile> => {
    return await api<TeacherProfile>('/teacher/profile', {
      method: 'PATCH',
      body: data,
    })
  }

  const getPublicProfile = async (userId: string): Promise<TeacherProfile> => {
    return await api<TeacherProfile>(`/teacher/public-profile/${userId}`)
  }

  return {
    getSummary,
    getCohorts,
    getCohortAnalytics,
    getProfile,
    updateProfile,
    getPublicProfile,
  }
}
