import { useApi } from '~/shared/api'
import type { DashboardSummary } from '~/shared/types'

export const useDashboardApi = () => {
  const api = useApi()

  const getSummary = async (): Promise<DashboardSummary> => {
    return await api<DashboardSummary>('/dashboard/summary')
  }

  return {
    getSummary,
  }
}
