import { Injectable, NotFoundException } from '@nestjs/common'
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
    const stats = await this.prisma.userStats.findUnique({
      where: { userId },
    })

    if (!stats) {
      throw new NotFoundException('User stats not found')
    }

    const activeCourses = await this.prisma.course.findMany({
      where: {
        homeworks: {
          some: { studentId: userId },
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
    })

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

    const recentActivity = await this.prisma.userActivity.findMany({
      where: { userId },
      take: 7,
      orderBy: { date: 'desc' },
    })

    return {
      stats: {
        xp: stats.xp,
        level: stats.level,
        streak: stats.streak,
        completedCourses: stats.completedCourses,
        completedLessons: stats.completedLessons,
      },
      activeCourses: formattedCourses,
      recentActivity: recentActivity.reverse(),
    }
  }
}
