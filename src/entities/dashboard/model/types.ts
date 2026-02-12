import type { Course } from '../../course/model/types'
import type { UserStats } from '../../user/model/types'

export interface DashboardSummary {
  stats: UserStats
  activeCourses: Array<
    Course & {
      teacherName: string
      progress: number
      totalLessons: number
      completedLessons: number
    }
  >
  recentActivity: Array<{
    id: string
    date: string
    points: number
    type: string
  }>
}
