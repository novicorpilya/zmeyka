import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface TeacherDashboardSummary {
  stats: {
    totalCourses: number
    totalStudents: number
    pendingHomeworks: number
    activeToday: number
  }
  recentHomeworks: Array<{
    id: string
    studentName: string
    courseTitle: string
    submittedAt: Date
  }>
  coursesPerformance: Array<{
    id: string
    title: string
    studentsCount: number
    completionRate: number
    isPublished: boolean
  }>
  students: Array<{
    id: string
    name: string
    avatar: string | null
    email: string
    homeworksCount: number
  }>
}

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) { }

  async getDashboardSummary(teacherId: string): Promise<TeacherDashboardSummary> {
    // 1. Fetch courses owned by teacher
    const teacherCourses = await this.prisma.course.findMany({
      where: { teacherId },
      select: {
        id: true,
        title: true,
        isPublished: true,
        _count: {
          select: {
            homeworks: true, // Count of students who submitted homework
            modules: true
          }
        },
        modules: {
          select: {
            _count: { select: { lessons: true } }
          }
        }
      },
      take: 10 // Limit for performance
    })

    const courseIds = teacherCourses.map((c) => c.id)

    // 2. Optimized batch queries for stats
    const [totalCourses, homeworkGroups, pendingHomeworksCount, recentHomeworks, completionsData] = await Promise.all([
      this.prisma.course.count({ where: { teacherId } }),
      this.prisma.homework.groupBy({
        by: ['studentId'],
        where: { courseId: { in: courseIds } },
        _count: true,
      }),
      this.prisma.homework.count({
        where: {
          courseId: { in: courseIds },
          status: 'PENDING',
        },
      }),
      this.prisma.homework.findMany({
        where: {
          courseId: { in: courseIds },
          status: 'PENDING',
        },
        include: {
          student: { select: { name: true, avatar: true } },
          course: { select: { title: true } },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      // Batch fetch completions per course
      this.prisma.userProgress.groupBy({
        by: ['lessonId'], // We'll need to map this back to courses
        where: {
          isCompleted: true,
          lesson: { module: { courseId: { in: courseIds } } }
        },
        _count: true
      })
    ])

    // 3. Since completionsData is grouped by lessonId, we need a better way to get per-course completions
    // Actually, a better optimized query for completions per course:
    const courseCompletions = await Promise.all(
      courseIds.map(id =>
        this.prisma.userProgress.count({
          where: {
            lesson: { module: { courseId: id } },
            isCompleted: true
          }
        })
      )
    )

    const formattedPerformance = teacherCourses.map((c, index) => {
      const studentsCount = c._count.homeworks
      const lessonCount = c.modules.reduce((acc, m) => acc + m._count.lessons, 0)
      const totalPossibleCompletions = lessonCount * studentsCount
      const completions = courseCompletions[index]

      return {
        id: c.id,
        title: c.title,
        isPublished: c.isPublished,
        studentsCount,
        completionRate:
          totalPossibleCompletions > 0
            ? Math.round((completions / totalPossibleCompletions) * 100)
            : 0,
      }
    })

    // 4. Students list
    const students = await this.prisma.user.findMany({
      where: { homeworks: { some: { courseId: { in: courseIds } } } },
      select: {
        id: true,
        name: true,
        avatar: true,
        email: true,
        _count: {
          select: { homeworks: { where: { courseId: { in: courseIds } } } },
        },
      },
      take: 10,
    })

    const studentIds = students.map(u => u.id)

    // 5. Activity today
    const activeToday = await this.prisma.userActivity.count({
      where: {
        userId: { in: studentIds },
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    })

    return {
      stats: {
        totalCourses,
        totalStudents: homeworkGroups.length,
        pendingHomeworks: pendingHomeworksCount,
        activeToday,
      },
      recentHomeworks: recentHomeworks.map((h) => ({
        id: h.id,
        studentName: h.student.name || 'Аноним',
        courseTitle: h.course.title,
        submittedAt: h.createdAt,
      })),
      coursesPerformance: formattedPerformance,
      students: students.map((u) => ({
        id: u.id,
        name: u.name || 'Аноним',
        avatar: u.avatar,
        email: u.email,
        homeworksCount: u._count.homeworks,
      })),
    }
  }
}
