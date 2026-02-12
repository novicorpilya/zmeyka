import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

import { ProgressUtil } from '../shared/utils/progress.util'

export interface DashboardSummary {
  stats: {
    xp: number
    level: number
    streak: number
    completedCourses: number
    completedLessons: number
  }
  activeCourses: Array<{
    id: string
    title: string
    thumbnail: string | null
    teacherName: string
    progress: number
    totalLessons: number
    completedLessons: number
  }>
  recentActivity: Array<{
    id: string
    date: Date
    points: number
    type: string
  }>
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string): Promise<DashboardSummary> {
    const [stats, activeCourses, recentActivity] = await Promise.all([
      this.prisma.userStats.findUnique({
        where: { userId },
      }),
      this.prisma.course.findMany({
        where: {
          cohorts: {
            some: {
              students: {
                some: { id: userId },
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          modules: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  progress: {
                    where: { userId },
                    select: { isCompleted: true },
                  },
                },
              },
            },
          },
          teacher: {
            select: { name: true, avatar: true },
          },
        },
        take: 3,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.userActivity.findMany({
        where: { userId },
        take: 7,
        orderBy: { date: 'desc' },
      }),
    ])

    if (!stats) {
      // Auto-create missing stats if they somehow disappeared (e.g. after manual DB cleanup)
      const newStats = await this.prisma.userStats.create({
        data: { userId },
      })
      return {
        stats: {
          xp: newStats.xp,
          level: newStats.level,
          streak: newStats.streak,
          completedCourses: newStats.completedCourses,
          completedLessons: newStats.completedLessons,
        },
        activeCourses: [],
        recentActivity: [],
      }
    }

    // Calculate real stats dynamically
    const completedLessonsCount = await this.prisma.userProgress.count({
      where: { userId, isCompleted: true },
    })

    const allUserCourses = await this.prisma.course.findMany({
      where: {
        cohorts: {
          some: { students: { some: { id: userId } } },
        },
      },
      select: {
        id: true,
        modules: {
          select: {
            id: true,
            lessons: {
              select: {
                id: true,
                progress: {
                  where: { userId },
                  select: { isCompleted: true },
                },
              },
            },
          },
        },
      },
    })

    const completedCoursesCount = allUserCourses.filter((course) => {
      const { progress } = ProgressUtil.calculateProgress(course.modules, userId)
      return progress === 100
    }).length

    const formattedCourses = activeCourses.map((course) => {
      const { progress, totalLessons, completedLessons } = ProgressUtil.calculateProgress(
        course.modules,
        userId,
      )

      return {
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        teacherName: course.teacher?.name || 'Мастер',
        progress,
        totalLessons,
        completedLessons,
      }
    })

    return {
      stats: {
        xp: stats.xp,
        level: stats.level,
        streak: stats.streak,
        completedCourses: completedCoursesCount,
        completedLessons: completedLessonsCount,
      },
      activeCourses: formattedCourses,
      recentActivity: recentActivity.reverse(),
    }
  }

  async getActivity(userId: string): Promise<Array<{ date: string; points: number }>> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activities = await this.prisma.userActivity.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'asc' },
    })

    // Group by date to sum points
    const grouped = activities.reduce(
      (acc, curr) => {
        const dateStr = curr.date.toISOString().split('T')[0]
        acc[dateStr] = (acc[dateStr] || 0) + curr.points
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(grouped).map(([date, points]) => ({
      date,
      points,
    }))
  }
}
