import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface ModuleCreateInput {
  title: string
  courseId: string
  order: number
}

export interface LessonCreateInput {
  title: string
  moduleId: string
  order: number
  videoUrl?: string
  content?: string
  conspectusFile?: string
  homeworkFile?: string
}

export interface LessonUpdateInput {
  title?: string
  order?: number
  videoUrl?: string
  content?: string
  contentRich?: string
  homeworkTitle?: string
  homeworkTask?: string
  conspectusFile?: string
  homeworkFile?: string
}

@Injectable()
export class BuilderService {
  constructor(private prisma: PrismaService) {}

  async getFullStructure(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!course) throw new NotFoundException('Course not found')
    return course
  }

  async createModule(data: ModuleCreateInput) {
    return this.prisma.module.create({ data })
  }

  async updateModule(id: string, data: { title?: string; order?: number }) {
    return this.prisma.module.update({
      where: { id },
      data,
    })
  }

  async deleteModule(id: string) {
    return this.prisma.module.delete({ where: { id } })
  }

  async createLesson(data: LessonCreateInput) {
    return this.prisma.lesson.create({ data })
  }

  async updateLesson(id: string, data: LessonUpdateInput) {
    return this.prisma.lesson.update({
      where: { id },
      data,
    })
  }

  async deleteLesson(id: string) {
    return this.prisma.lesson.delete({ where: { id } })
  }

  async updateOrders(type: 'module' | 'lesson', orders: { id: string; order: number }[]) {
    return this.prisma.$transaction(
      orders.map((msg) => {
        if (type === 'module') {
          return this.prisma.module.update({
            where: { id: msg.id },
            data: { order: msg.order },
          })
        } else {
          return this.prisma.lesson.update({
            where: { id: msg.id },
            data: { order: msg.order },
          })
        }
      }),
    )
  }

  async validateOwnership(
    userId: string,
    target: {
      courseId?: string
      moduleId?: string
      lessonId?: string
      quizId?: string
      questionId?: string
    },
  ) {
    let courseId: string | undefined = target.courseId

    if (target.moduleId) {
      const module = await this.prisma.module.findUnique({ where: { id: target.moduleId } })
      if (!module) throw new NotFoundException('Module not found')
      courseId = module.courseId
    } else if (target.lessonId) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: target.lessonId },
        include: { module: true },
      })
      if (!lesson) throw new NotFoundException('Lesson not found')
      courseId = lesson.module.courseId
    } else if (target.quizId) {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: target.quizId },
        include: { lesson: { include: { module: true } } },
      })
      if (!quiz) throw new NotFoundException('Quiz not found')
      courseId = quiz.lesson.module.courseId
    } else if (target.questionId) {
      const question = await this.prisma.question.findUnique({
        where: { id: target.questionId },
        include: { quiz: { include: { lesson: { include: { module: true } } } } },
      })
      if (!question) throw new NotFoundException('Question not found')
      courseId = question.quiz.lesson.module.courseId
    }

    if (!courseId) throw new BadRequestException('Target ID is required for ownership validation')

    const course = await this.prisma.course.findUnique({ where: { id: courseId } })
    if (!course) throw new NotFoundException('Course not found')
    if (course.teacherId !== userId) {
      throw new ForbiddenException('You do not own this course content')
    }
  }

  async getQuiz(lessonId: string) {
    return this.prisma.quiz.findUnique({
      where: { lessonId },
      include: { questions: true },
    })
  }

  async ensureQuiz(lessonId: string) {
    let quiz = await this.prisma.quiz.findUnique({ where: { lessonId } })
    if (!quiz) {
      quiz = await this.prisma.quiz.create({
        data: { lessonId },
      })
    }
    return quiz
  }

  async addQuestion(
    quizId: string,
    data: { text: string; options: string; correctOption: number },
  ) {
    return this.prisma.question.create({
      data: { ...data, quizId },
    })
  }

  async updateQuestion(
    id: string,
    data: { text?: string; options?: string; correctOption?: number },
  ) {
    return this.prisma.question.update({
      where: { id },
      data,
    })
  }

  async deleteQuestion(id: string) {
    return this.prisma.question.delete({ where: { id } })
  }
}
