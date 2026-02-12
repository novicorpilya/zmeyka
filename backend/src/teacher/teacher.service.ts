import { Injectable, Inject, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

export interface TeacherDashboardSummary {
  stats: {
    totalCourses: number
    totalStudents: number
    pendingHomeworks: number
    activeToday: number
    homeworksThisWeek: number
    averageScore: number
    globalCompletionRate: number
  }
  recentHomeworks: Array<{
    id: string
    studentName: string
    courseTitle: string
    submittedAt: Date
    commentsCount: number
  }>
  coursesPerformance: Array<{
    id: string
    title: string
    isPublished: boolean
    studentsCount: number
    completionRate: number
  }>
  students: Array<{
    id: string
    name: string
    avatar: string | null
    email: string
    homeworksCount: number
    lastHomeworkId: string | null
  }>
}

interface TeacherCourse {
  id: string
  title: string
  isPublished: boolean
  _count: { homeworks: number; modules: number }
  modules: Array<{
    _count: { lessons: number }
    courseId: string
  }>
}

interface RecentHomeworkRow {
  id: string
  createdAt: Date
  student: { name: string | null; avatar: string | null } | null
  course: { title: string } | null
  _count: { comments: number }
}

interface StudentRow {
  id: string
  name: string | null
  avatar: string | null
  email: string
  homeworks: Array<{ id: string; status: string }>
  _count: { homeworks: number }
}

interface CompletionGroup {
  lessonId: string
  _count: number | { _all: number }
}

interface HomeworkGroup {
  studentId: string
  _count: number | { _all: number }
}

const EMPTY_SUMMARY: TeacherDashboardSummary = {
  stats: {
    totalCourses: 0,
    totalStudents: 0,
    pendingHomeworks: 0,
    activeToday: 0,
    homeworksThisWeek: 0,
    averageScore: 0,
    globalCompletionRate: 0,
  },
  recentHomeworks: [],
  coursesPerformance: [],
  students: [],
}

@Injectable()
export class TeacherService {
  private readonly logger = new Logger(TeacherService.name)
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async getDashboardSummary(teacherId: string): Promise<TeacherDashboardSummary> {
    const cacheKey = `teacher_dashboard_${teacherId}`

    const cachedData = await this.getCachedSummary(cacheKey)
    if (cachedData) {
      this.logger.log(`[getDashboardSummary] Returning cached data for teacher: ${teacherId}`)
      return cachedData
    }

    try {
      this.logger.log(
        `[getDashboardSummary] Cache miss. Fetching fresh data for teacher: ${teacherId}`,
      )

      const teacherCourses = await this.fetchTeacherCourses(teacherId)
      if (!teacherCourses.length) {
        this.logger.warn(`[TeacherService] No courses found for teacher ${teacherId}`)
        return { ...EMPTY_SUMMARY }
      }

      const courseIds = teacherCourses.map((c) => c.id)
      this.logger.log(`[TeacherService] Found ${courseIds.length} courses: ${courseIds.join(', ')}`)

      const [stats, recentHomeworks, coursesPerformance, students] = await Promise.all([
        this.computeStats(teacherId, courseIds),
        this.fetchRecentHomeworks(teacherId, courseIds),
        this.computeCoursesPerformance(teacherCourses, courseIds),
        this.fetchStudents(teacherId, courseIds),
      ])

      const summary: TeacherDashboardSummary = {
        stats,
        recentHomeworks,
        coursesPerformance,
        students,
      }

      // Cache for 60 seconds (down from 5 minutes) to keep it fresher
      await this.setCachedSummary(cacheKey, summary, 60000)
      return summary
    } catch (e) {
      this.logger.error('CRITICAL: Failed to get teacher dashboard summary:', e)
      return { ...EMPTY_SUMMARY }
    }
  }

  // ── Private helpers ────────────────────────────────────

  private async getCachedSummary(key: string): Promise<TeacherDashboardSummary | undefined> {
    try {
      return await this.cacheManager.get<TeacherDashboardSummary>(key)
    } catch (error) {
      this.logger.warn('Dashboard cache get failed (treating as miss):', error)
      return undefined
    }
  }

  private async setCachedSummary(
    key: string,
    data: TeacherDashboardSummary,
    ttl: number,
  ): Promise<void> {
    try {
      await this.cacheManager.set(key, data, ttl)
    } catch (cacheError) {
      this.logger.warn('Cache set failed', cacheError)
    }
  }

  private async fetchTeacherCourses(teacherId: string): Promise<TeacherCourse[]> {
    return this.prisma.course
      .findMany({
        where: { teacherId },
        select: {
          id: true,
          title: true,
          isPublished: true,
          _count: {
            select: {
              homeworks: true,
              modules: true,
            },
          },
          modules: {
            select: {
              _count: { select: { lessons: true } },
              courseId: true,
            },
          },
        },
        take: 20,
      })
      .catch((err) => {
        this.logger.error(`[TeacherService] teacherCourses fetch failed`, err)
        return []
      }) as Promise<TeacherCourse[]>
  }

  private async computeStats(
    teacherId: string,
    courseIds: string[],
  ): Promise<TeacherDashboardSummary['stats']> {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)

    const [
      totalCourses,
      totalStudents,
      pendingHomeworksCount,
      activeToday,
      homeworksThisWeek,
      avgScoreData,
    ] = await Promise.all([
      this.prisma.course.count({ where: { teacherId } }).catch((e) => {
        this.logger.error('count courses failed', e)
        return 0
      }),

      this.prisma.user
        .count({
          where: {
            id: { not: teacherId },
            OR: [
              { cohorts: { some: { courseId: { in: courseIds } } } },
              { homeworks: { some: { courseId: { in: courseIds } } } },
            ],
          },
        })
        .catch((e) => {
          this.logger.error('count students failed', e)
          return 0
        }),

      this.prisma.homework
        .count({
          where: { courseId: { in: courseIds }, status: 'PENDING', studentId: { not: teacherId } },
        })
        .catch((e) => {
          this.logger.error('count pending failed', e)
          return 0
        }),

      this.computeActiveToday(teacherId, courseIds),

      this.prisma.homework
        .count({
          where: {
            courseId: { in: courseIds },
            createdAt: { gte: lastWeek },
            studentId: { not: teacherId },
          },
        })
        .catch(() => 0),

      this.prisma.homework
        .aggregate({
          where: { courseId: { in: courseIds }, status: 'COMPLETED', score: { not: null } },
          _avg: { score: true },
        })
        .catch(() => ({ _avg: { score: 0 } })),
    ])

    // Fetch performance to compute global completion rate
    const teacherCourses = await this.fetchTeacherCourses(teacherId)
    const performance = await this.computeCoursesPerformance(teacherCourses, courseIds)
    const globalCompletionRate =
      performance.length > 0
        ? Math.round(
          performance.reduce((acc, c) => acc + (c.completionRate || 0), 0) / performance.length,
        )
        : 0

    return {
      totalCourses: Number(totalCourses) || 0,
      totalStudents: Number(totalStudents) || 0,
      pendingHomeworks: Number(pendingHomeworksCount) || 0,
      activeToday,
      homeworksThisWeek: Number(homeworksThisWeek) || 0,
      averageScore: Number(avgScoreData?._avg?.score?.toFixed(1)) || 0,
      globalCompletionRate,
    }
  }

  private async computeActiveToday(teacherId: string, courseIds: string[]): Promise<number> {
    const activeTodayGroups = await this.prisma.userActivity
      .groupBy({
        by: ['userId'],
        where: {
          date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          userId: { not: teacherId },
          user: {
            OR: [
              { cohorts: { some: { courseId: { in: courseIds } } } },
              { homeworks: { some: { courseId: { in: courseIds } } } },
            ],
          },
        },
      })
      .catch((err) => {
        this.logger.error('Failed to get activeToday unique count', err)
        return []
      })
    return activeTodayGroups.length
  }

  private async fetchRecentHomeworks(
    teacherId: string,
    courseIds: string[],
  ): Promise<TeacherDashboardSummary['recentHomeworks']> {
    const rows = (await this.prisma.homework
      .findMany({
        where: {
          courseId: { in: courseIds },
          studentId: { not: teacherId },
          OR: [{ status: 'PENDING' }, { status: 'NEEDS_REVIEW' }, { comments: { some: {} } }],
        },
        include: {
          student: { select: { name: true, avatar: true } },
          course: { select: { title: true } },
          _count: { select: { comments: true } },
        },
        take: 10,
        orderBy: { updatedAt: 'desc' },
      })
      .catch((e) => {
        this.logger.error('find recent failed', e)
        return []
      })) as RecentHomeworkRow[]

    return rows.map((h) => ({
      id: h.id,
      studentName: h.student?.name || 'Аноним',
      courseTitle: h.course?.title || 'Course',
      submittedAt: h.createdAt || new Date(),
      commentsCount: h._count?.comments || 0,
    }))
  }

  private async computeCoursesPerformance(
    teacherCourses: TeacherCourse[],
    courseIds: string[],
  ): Promise<TeacherDashboardSummary['coursesPerformance']> {
    // Fetch lesson-to-course mapping
    const allLessons = await this.prisma.lesson
      .findMany({
        where: { module: { courseId: { in: courseIds } } },
        select: { id: true, module: { select: { courseId: true } } },
      })
      .catch((err) => {
        this.logger.error('[TeacherService] allLessons fetch failed', err)
        return []
      })

    const lessonCourseMap = new Map<string, string>()
    allLessons.forEach((l) => {
      if (l.module?.courseId) {
        lessonCourseMap.set(l.id, l.module.courseId)
      }
    })

    // Progress groupBy
    const completionsData = (await this.prisma.userProgress
      .groupBy({
        by: ['lessonId'],
        where: {
          isCompleted: true,
          lesson: { module: { courseId: { in: courseIds } } },
        },
        _count: true,
      })
      .catch((e) => {
        this.logger.error('progress groupBy failed', e)
        return []
      })) as CompletionGroup[]

    const courseCompletionCounts = new Map<string, number>()
    completionsData.forEach((group) => {
      const courseId = lessonCourseMap.get(group.lessonId)
      if (courseId) {
        const current = courseCompletionCounts.get(courseId) || 0
        const count = typeof group._count === 'number' ? group._count : group._count?._all || 0
        courseCompletionCounts.set(courseId, current + count)
      }
    })

    return teacherCourses.map((c) => {
      const studentsCount = c._count?.homeworks || 0
      const lessonCount = (c.modules || []).reduce((acc, m) => acc + (m._count?.lessons || 0), 0)
      const totalPossibleCompletions = lessonCount * studentsCount
      const completions = courseCompletionCounts.get(c.id) || 0

      return {
        id: c.id,
        title: c.title,
        isPublished: c.isPublished || false,
        studentsCount,
        completionRate:
          totalPossibleCompletions > 0
            ? Math.round((completions / totalPossibleCompletions) * 100)
            : 0,
      }
    })
  }

  private async fetchStudents(
    teacherId: string,
    courseIds: string[],
  ): Promise<TeacherDashboardSummary['students']> {
    const rows = (await this.prisma.user
      .findMany({
        where: {
          id: { not: teacherId },
          OR: [
            { cohorts: { some: { courseId: { in: courseIds } } } },
            { homeworks: { some: { courseId: { in: courseIds } } } },
          ],
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          email: true,
          homeworks: {
            where: { courseId: { in: courseIds } },
            select: { id: true, status: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { homeworks: { where: { courseId: { in: courseIds } } } },
          },
        },
        take: 20,
      })
      .catch((err) => {
        this.logger.error('[TeacherService] Students list fetch failed', err)
        return []
      })) as StudentRow[]

    return rows.map((u) => ({
      id: u.id,
      name: u.name || 'Аноним',
      avatar: u.avatar,
      email: u.email,
      homeworksCount: u._count?.homeworks || 0,
      lastHomeworkId: u.homeworks && u.homeworks[0] ? u.homeworks[0].id : null,
    }))
  }

  async getProfile(userId: string) {
    let profile = await this.prisma.teacherProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      profile = await this.prisma.teacherProfile.create({
        data: { userId },
      })
    }

    return profile
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.teacherProfile.upsert({
      where: { userId },
      update: data,
      create: { ...data, userId },
    })
  }

  async getPublicProfile(userId: string) {
    const profile = await this.prisma.teacherProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })

    if (!profile) return null

    return {
      ...profile,
      name: profile.user.name,
      avatar: profile.user.avatar,
    }
  }
}
