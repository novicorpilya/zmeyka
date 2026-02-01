import { useApi } from '~/shared/api'
import type { TeacherDashboardSummary } from '~/shared/types'

export const useTeacherApi = () => {
  const api = useApi()

  const getSummary = async () => {
    return await api<TeacherDashboardSummary>('/teacher/dashboard/summary')
  }

  return {
    getSummary,
  }
}
