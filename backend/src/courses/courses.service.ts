import { Injectable, NotFoundException, ForbiddenException, Inject, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Course, Prisma } from '@prisma/client'
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto'
import { ProgressUtil } from '../shared/utils/progress.util'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { CourseEnrolledEvent } from '../shared/events/course-enrolled.event'
import { EventEmitter2 } from '@nestjs/event-emitter'

export interface LessonWithProgress {
  id: string
  title: string
  order: number
  contentRich: string | null
  videoUrl: string | null
  chapters: string | null
  isLocked?: boolean
  isPreview?: boolean
  progress?: Array<{ isCompleted: boolean }>
}

export interface ModuleWithLessons {
  id: string
  title: string
  order: number
  lessons: LessonWithProgress[]
}

export interface CourseWithCalculatedProgress {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  teacherId: string
  progress: number
  xp: number
  calculatedProgress: number
  calculatedXp: number
  isPublished: boolean
  isEnrolled?: boolean
  studentsCount?: number
  plannedLessonsCount: number
  price: number
  mentoringPrice: number
  introVideoUrl: string | null
  modules: ModuleWithLessons[]
  teacher: { name: string | null; avatar: string | null }
}

export interface CourseSummary extends Course {
  studentsCount: number
  price: number
  mentoringPrice: number
  introVideoUrl: string | null
}

interface PrismaLessonResult {
  id: string
  title: string
  order: number
  videoUrl: string | null
  isPreview: boolean
  contentRich: string | null
  chapters: string | null
  progress: Array<{ isCompleted: boolean }>
  [key: string]: unknown
}
interface PrismaModuleResult {
  id: string
  title: string
  order: number
  lessons: PrismaLessonResult[]
}

interface PrismaCourseResult extends Course {
  price: number
  mentoringPrice: number
  introVideoUrl: string | null
  modules: PrismaModuleResult[]
  teacher: { name: string | null; avatar: string | null }
}

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name)

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createCourseDto: CreateCourseDto & { teacherId: string }): Promise<Course> {
    const course = await this.prisma.course.create({
      data: createCourseDto,
    })
    await this.cacheManager.del(`teacher_dashboard_${createCourseDto.teacherId}`)
    return course
  }

  async findAll(onlyPublished = true, userId?: string): Promise<CourseSummary[]> {
    this.logger.log(`[findAll] userId: ${userId}, onlyPublished: ${onlyPublished}`)

    let whereClause: Prisma.CourseWhereInput = {}

    if (!userId) {
      whereClause = { isPublished: true }
    } else {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      })

      if (user && (user.role === 'TEACHER' || user.role === 'ADMIN')) {
        // Teachers and Admins see ALL courses to prevent "disappearance" bugs
        whereClause = {}
      } else {
        // Students see published + enrolled
        whereClause = {
          OR: [
            { isPublished: true },
            { cohorts: { some: { students: { some: { id: userId } } } } },
          ],
        }
      }
    }

    const courses = await this.prisma.course.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return Promise.all(
      courses.map(async (course) => {
        const studentsCount = await this.prisma.user.count({
          where: {
            OR: [
              { cohorts: { some: { courseId: course.id } } },
              { progress: { some: { lesson: { module: { courseId: course.id } } } } },
            ],
          },
        })
        const c = course as unknown as PrismaCourseResult
        return {
          ...c,
          price: c.price,
          mentoringPrice: c.mentoringPrice,
          studentsCount,
        } as CourseSummary
      }),
    )
  }

  async findByTeacher(teacherId: string): Promise<CourseSummary[]> {
    const courses = await this.prisma.course.findMany({
      where: { teacherId, isPublished: true },
      include: {
        teacher: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return Promise.all(
      courses.map(async (course) => {
        const studentsCount = await this.prisma.user.count({
          where: {
            OR: [
              { cohorts: { some: { courseId: course.id } } },
              { progress: { some: { lesson: { module: { courseId: course.id } } } } },
            ],
          },
        })
        const c = course as unknown as PrismaCourseResult
        return {
          ...c,
          price: c.price,
          mentoringPrice: c.mentoringPrice,
          studentsCount,
        } as CourseSummary
      }),
    )
  }

  async findOne(
    id: string,
    userId?: string,
    checkVisibility = false,
  ): Promise<CourseWithCalculatedProgress> {
    const course = await (
      this.prisma.course as unknown as {
        findUnique: (args: unknown) => Promise<PrismaCourseResult | null>
      }
    ).findUnique({
      where: { id },
      include: {
        teacher: {
          select: { name: true, avatar: true },
        },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                content: true,
                contentRich: true,
                conspectusFile: true,
                videoUrl: true,
                homeworkTitle: true,
                homeworkTask: true,
                homeworkFile: true,
                trinketUrl: true,
                chapters: true,
                order: true,
                moduleId: true,
                isPreview: true,
                progress: userId
                  ? {
                      where: { userId },
                    }
                  : false,
              },
            },
          },
        },
      },
    })

    if (!course) throw new NotFoundException('Course not found')
    const c = course as unknown as PrismaCourseResult

    const studentsCount = await this.prisma.user.count({
      where: {
        OR: [
          { cohorts: { some: { courseId: c.id } } },
          { progress: { some: { lesson: { module: { courseId: c.id } } } } },
        ],
      },
    })

    // Visibility check for students
    if (checkVisibility && !c.isPublished) {
      throw new NotFoundException('Course not found')
    }

    const isEnrolled = userId
      ? (await this.prisma.user.count({
          where: { id: userId, cohorts: { some: { courseId: id } } },
        })) > 0
      : false

    // LESSON LOCKING LOGIC (Senior Feature)
    // Flatten all lessons into a single ordered list to track sequential unlocking
    let isPreviousCompleted = true // First lesson is always unlocked
    const modulesWithLocking = c.modules.map((module: PrismaModuleResult) => ({
      ...module,
      lessons: module.lessons.map((lesson: PrismaLessonResult) => {
        const lessonObj = lesson
        const isCompleted =
          lessonObj.progress &&
          Array.isArray(lessonObj.progress) &&
          lessonObj.progress.length > 0 &&
          lessonObj.progress[0].isCompleted

        // If enrolled, locking is based on progress. If not, only previews are unlocked.
        // Actually, we want sequential unlocking even for enrolled students.
        // But for previews, IT'S ALWAYS UNLOCKED.
        const isLocked = !isPreviousCompleted && !lessonObj.isPreview

        // Update isPreviousCompleted for the NEXT lesson
        isPreviousCompleted = !!isCompleted || isEnrolled === false // If not enrolled, previous "completed" doesn't apply beyond the first/previews

        // Correct logic for guest/non-enrolled:
        // If not enrolled: 1st lesson is unlocked (isPreviousCompleted starts true), others locked unless isPreview.
        // Wait, if isEnrolled is false, isCompleted will always be false.
        // So sequential locking will stop after the 1st lesson unless it's a preview.

        return {
          ...lessonObj,
          isLocked: isLocked && !isCompleted,
        }
      }),
    }))

    if (!userId) {
      return {
        ...c,
        isPublished: c.isPublished,
        progress: 0,
        xp: 0,
        calculatedProgress: 0,
        calculatedXp: 0,
        price: c.price,
        mentoringPrice: c.mentoringPrice,
        introVideoUrl: c.introVideoUrl,
        isEnrolled: false,
        studentsCount,
        modules: modulesWithLocking,
        teacher: c.teacher,
      }
    }

    const { progress, xp } = ProgressUtil.calculateProgress(c.modules, userId)

    return {
      ...c,
      isPublished: c.isPublished,
      progress,
      xp,
      calculatedProgress: progress,
      calculatedXp: xp,
      price: c.price,
      mentoringPrice: c.mentoringPrice,
      introVideoUrl: c.introVideoUrl,
      isEnrolled,
      studentsCount,
      modules: modulesWithLocking,
      teacher: c.teacher,
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    })
    await this.cacheManager.del(`teacher_dashboard_${course.teacherId}`)
    return course
  }

  async checkOwnership(courseId: string, userId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    })
    if (!course) throw new NotFoundException('Course not found')
    if (course.teacherId !== userId) {
      throw new ForbiddenException('You do not own this course')
    }
  }

  async remove(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({ where: { id } })
    if (course) {
      await this.cacheManager.del(`teacher_dashboard_${course.teacherId}`)
    }
    return this.prisma.course.delete({
      where: { id },
    })
  }

  async enroll(
    courseId: string,
    userId: string,
  ): Promise<{ id: string; email: string; name: string | null }> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get current course with latest cohort
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: {
          cohorts: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      })

      if (!course) throw new NotFoundException('Course not found')

      let targetCohortId = course.cohorts[0]?.id

      // 2. Create default cohort if none exists (Atomic fallback)
      if (!targetCohortId) {
        const newCohort = await tx.cohort.create({
          data: {
            name: 'Первый поток (Авто)',
            courseId: courseId,
          },
        })
        targetCohortId = newCohort.id
      }

      // 3. Perform enrollment (Connect via cohort ONLY to avoid hijacking teacher role)
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          cohorts: { connect: { id: targetCohortId } },
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      })

      this.eventEmitter.emit(
        'course.enrolled',
        new CourseEnrolledEvent(
          userId,
          courseId,
          course.title,
          course.teacherId,
          user.name || 'Студент',
        ),
      )

      return user
    })
  }

  async completeLesson(
    userId: string,
    lessonId: string,
  ): Promise<{ userId: string; lessonId: string; isCompleted: boolean; completedAt: Date | null }> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    })

    if (!lesson) throw new NotFoundException('Lesson not found')

    const progress = await this.prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    })

    return progress
  }

  async claimOwnership(courseId: string, userId: string): Promise<Course> {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { teacherId: userId },
    })
  }

  async search(query: string): Promise<{
    courses: Array<{
      id: string
      title: string
      thumbnail: string | null
      teacher: { name: string | null }
    }>
    lessons: Array<{
      id: string
      title: string
      homeworkTitle: string | null
      module: {
        title: string
        course: { id: string; title: string; thumbnail: string | null }
      }
    }>
  }> {
    if (!query) return { courses: [], lessons: [] }

    const courses = await this.prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        isPublished: true,
      },
      take: 5,
      select: {
        id: true,
        title: true,
        thumbnail: true,
        teacher: { select: { name: true } },
      },
    })

    const lessons = await this.prisma.lesson.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
        module: { course: { isPublished: true } },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        homeworkTitle: true,
        module: {
          select: {
            title: true,
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    })

    return { courses, lessons }
  }
}
