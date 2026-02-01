import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto'
import { ProgressUtil } from '../shared/utils/progress.util'

export interface LessonWithProgress {
  id: string
  title: string
  order: number
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
  modules: ModuleWithLessons[]
  teacher: { name: string | null; avatar: string | null }
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto & { teacherId: string }) {
    return this.prisma.course.create({
      data: createCourseDto,
    })
  }

  async findAll(onlyPublished = true) {
    return this.prisma.course.findMany({
      where: onlyPublished ? { isPublished: true } : {},
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  async findOne(
    id: string,
    userId?: string,
    checkVisibility = false,
  ): Promise<CourseWithCalculatedProgress> {
    const course = await this.prisma.course.findUnique({
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
              include: {
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

    // Visibility check for students
    if (checkVisibility && !course.isPublished) {
      throw new NotFoundException('Course not found')
    }

    if (!userId) {
      return {
        ...course,
        isPublished: course.isPublished,
        progress: 0,
        xp: 0,
        calculatedProgress: 0,
        calculatedXp: 0,
        modules: course.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) => ({ ...l, progress: [] })),
        })),
      }
    }

    const { progress, xp } = ProgressUtil.calculateProgress(course.modules, userId)

    return {
      ...course,
      isPublished: course.isPublished,
      progress,
      xp,
      calculatedProgress: progress,
      calculatedXp: xp,
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    })
  }

  async remove(id: string) {
    return this.prisma.course.delete({
      where: { id },
    })
  }
}
