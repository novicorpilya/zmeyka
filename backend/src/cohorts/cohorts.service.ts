import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { Prisma, Cohort } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

export interface CreateCohortDto {
  name: string
  courseId: string
  startDate?: Date
  endDate?: Date
}

interface CohortWithCourse extends Cohort {
  course: { title: string }
}

interface CohortWithDetails extends Cohort {
  students: Array<{ id: string; email: string; name: string | null; avatar: string | null }>
  courseId: string
}

interface DropOffAnalytics {
  lessonId: string
  lessonTitle: string
  completedCount: number
  totalStudents: number
  completionRate: number
}

@Injectable()
export class CohortsService {
  private readonly logger = new Logger(CohortsService.name)

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCohortDto): Promise<Cohort> {
    const course = await this.prisma.course.update({
      where: { id: dto.courseId },
      data: {
        cohorts: {
          create: {
            name: dto.name,
            startDate: dto.startDate,
            endDate: dto.endDate,
          },
        },
      },
      include: {
        cohorts: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })
    return course.cohorts[0]
  }

  async findAllByTeacher(teacherId: string): Promise<CohortWithCourse[]> {
    const courses = await this.prisma.course.findMany({
      where: { teacherId },
      include: {
        cohorts: {
          include: {
            _count: {
              select: { students: true },
            },
          },
        },
      },
    })

    return courses.flatMap((course) =>
      course.cohorts.map((cohort) => ({
        ...cohort,
        course: { title: course.title },
      })),
    )
  }

  async findOne(id: string): Promise<CohortWithDetails> {
    // Find cohort via course relation to ensure type safety while IDE is syncing
    const course = await this.prisma.course.findFirst({
      where: {
        cohorts: { some: { id } },
      },
      include: {
        cohorts: {
          where: { id },
          include: {
            students: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!course || !course.cohorts[0]) {
      throw new NotFoundException('Cohort not found')
    }

    const cohort = course.cohorts[0]
    return {
      ...cohort,
      courseId: course.id,
    } as CohortWithDetails
  }

  async addStudent(cohortId: string, studentId: string): Promise<Cohort> {
    // First add the user to the cohort
    await this.prisma.user.update({
      where: { id: studentId },
      data: {
        cohorts: {
          connect: { id: cohortId },
        },
      } as Prisma.UserUpdateInput,
    })

    // Return the updated cohort
    const course = await this.prisma.course.findFirst({
      where: { cohorts: { some: { id: cohortId } } },
      include: {
        cohorts: {
          where: { id: cohortId },
        },
      },
    })

    if (!course || !course.cohorts[0]) {
      throw new NotFoundException('Cohort not found')
    }

    return course.cohorts[0]
  }

  async getDropOffAnalytics(cohortId: string): Promise<DropOffAnalytics[]> {
    const cohortData = await this.findOne(cohortId)

    const courseWithLessons = await this.prisma.course.findUnique({
      where: { id: cohortData.courseId },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!courseWithLessons) throw new NotFoundException('Course not found')

    const lessons = courseWithLessons.modules.flatMap((m) => m.lessons)

    // Optimized: Fetch all completion counts in one query using groupBy
    const studentIds = cohortData.students.map((s) => s.id)

    const progressStats = await this.prisma.userProgress.groupBy({
      by: ['lessonId'],
      where: {
        lessonId: { in: lessons.map((l) => l.id) },
        userId: { in: studentIds },
        isCompleted: true,
      },
      _count: {
        userId: true,
      },
    })

    const statsMap = new Map(progressStats.map((stat) => [stat.lessonId, stat._count.userId]))

    return lessons.map((lesson) => {
      const completedCount = statsMap.get(lesson.id) || 0
      return {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        completedCount,
        totalStudents: cohortData.students.length,
        completionRate:
          cohortData.students.length > 0 ? (completedCount / cohortData.students.length) * 100 : 0,
      }
    })
  }
}
