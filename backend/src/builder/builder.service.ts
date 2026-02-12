import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AIService } from '../ai/ai.service'
import { Course, Module, Lesson, Quiz, Question } from '@prisma/client'

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
  trinketUrl?: string
}

export interface LessonUpdateInput {
  title?: string
  order?: number
  videoUrl?: string | null
  content?: string | null
  contentRich?: string | null
  homeworkTitle?: string | null
  homeworkTask?: string | null
  conspectusFile?: string | null
  homeworkFile?: string | null
  homeworkSolution?: string | null
  trinketUrl?: string | null
  chapters?: string | null
  isPreview?: boolean
}

export type CourseWithModulesAndLessons = Course & {
  modules: (Module & { lessons: Lesson[] })[]
  studentsCount?: number
}

export type QuizWithQuestions = Quiz & { questions: Question[] }

@Injectable()
export class BuilderService {
  private readonly logger = new Logger(BuilderService.name)
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  async getFullStructure(courseId: string): Promise<CourseWithModulesAndLessons> {
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

    const studentsCount = await this.prisma.user.count({
      where: {
        OR: [
          {
            cohorts: {
              some: {
                courseId: course.id,
              },
            },
          },
          {
            progress: {
              some: {
                lesson: {
                  module: {
                    courseId: course.id,
                  },
                },
              },
            },
          },
        ],
      },
    })

    return {
      ...course,
      studentsCount,
    }
  }

  async createModule(data: ModuleCreateInput): Promise<Module> {
    return this.prisma.module.create({ data })
  }

  async updateModule(id: string, data: { title?: string; order?: number }): Promise<Module> {
    return this.prisma.module.update({
      where: { id },
      data,
    })
  }

  async deleteModule(id: string): Promise<Module> {
    return this.prisma.module.delete({ where: { id } })
  }

  async createLesson(data: LessonCreateInput): Promise<Lesson> {
    return this.prisma.lesson.create({ data })
  }

  async updateLesson(id: string, data: LessonUpdateInput): Promise<Lesson> {
    return this.prisma.lesson.update({
      where: { id },
      data,
    })
  }

  async deleteLesson(id: string): Promise<Lesson> {
    return this.prisma.lesson.delete({ where: { id } })
  }

  async updateOrders(
    type: 'module' | 'lesson',
    orders: { id: string; order: number }[],
  ): Promise<(Module | Lesson)[]> {
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
  ): Promise<void> {
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

    const requester = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    })
    if (!course) throw new NotFoundException('Course not found')

    if (course.teacherId !== userId) {
      if (requester?.role === 'TEACHER' || requester?.role === 'ADMIN') {
        this.logger.warn(
          `[validateOwnership] FORCE RECOVERY course ${courseId} assigned to teacher ${userId}`,
        )
        await this.prisma.course.update({
          where: { id: courseId },
          data: { teacherId: userId },
        })
        return
      }
      throw new ForbiddenException('You do not own this course content')
    }
  }

  async getQuiz(lessonId: string): Promise<QuizWithQuestions | null> {
    return this.prisma.quiz.findUnique({
      where: { lessonId },
      include: { questions: true },
    })
  }

  async ensureQuiz(lessonId: string): Promise<Quiz> {
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
  ): Promise<Question> {
    return this.prisma.question.create({
      data: { ...data, quizId },
    })
  }

  async updateQuestion(
    id: string,
    data: { text?: string; options?: string; correctOption?: number },
  ): Promise<Question> {
    return this.prisma.question.update({
      where: { id },
      data,
    })
  }

  async deleteQuestion(id: string): Promise<Question> {
    return this.prisma.question.delete({ where: { id } })
  }

  async generateAiQuiz(lessonId: string): Promise<Question[]> {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson || !lesson.contentRich) throw new BadRequestException('Lesson content is empty')

    this.logger.log(`[BuilderService] Generating quiz for lesson ${lessonId}`)
    const questions = await this.aiService.generateQuiz(lesson.contentRich)
    this.logger.log(`[BuilderService] AI generated ${questions.length} questions`)

    // Auto-create quiz and questions
    const quiz = await this.ensureQuiz(lessonId)
    this.logger.log(`[BuilderService] Quiz ensured: ${quiz.id}`)

    await this.prisma.question.deleteMany({ where: { quizId: quiz.id } })
    this.logger.log(`[BuilderService] Old questions deleted`)

    return this.prisma.$transaction(
      questions.map((q, idx) => {
        if (!q.text || !Array.isArray(q.options)) {
          this.logger.error(
            `[BuilderService] Invalid question at index ${idx}: ${JSON.stringify(q)}`,
          )
          throw new BadRequestException(`AI generated invalid question structure at index ${idx}`)
        }
        return this.prisma.question.create({
          data: {
            text: q.text,
            options: JSON.stringify(q.options),
            correctOption: typeof q.correctOption === 'number' ? q.correctOption : 0,
            quizId: quiz.id,
          },
        })
      }),
    )
  }

  async generateAiHomework(lessonId: string): Promise<Lesson> {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson || !lesson.contentRich) throw new BadRequestException('Lesson content is empty')

    const aiHomework = await this.aiService.generateHomework(lesson.contentRich)

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        homeworkTitle: aiHomework.title,
        homeworkTask: aiHomework.task,
        homeworkSolution: aiHomework.solution,
      },
    })
  }
}
