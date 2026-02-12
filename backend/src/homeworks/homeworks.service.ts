import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SubmitHomeworkDto, UpdateHomeworkStatusDto } from './dto/homework.dto'
import { CreateCommentDto } from './dto/comment.dto'
import { AIService } from '../ai/ai.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { HomeworkReviewedEvent } from '../shared/events/homework-reviewed.event'
import { HomeworkCommentAddedEvent } from '../shared/events/homework-comment-added.event'
import { HomeworkSubmittedEvent } from '../shared/events/homework-submitted.event'
import { Homework, Comment } from '@prisma/client'

@Injectable()
export class HomeworksService {
  private readonly logger = new Logger(HomeworksService.name)
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
    private eventEmitter: EventEmitter2,
  ) {}

  async submitHomework(userId: string, dto: SubmitHomeworkDto): Promise<Homework> {
    const homework = await this.prisma.homework.upsert({
      where: {
        lessonId_studentId: {
          lessonId: dto.lessonId,
          studentId: userId,
        },
      },
      update: {
        status: 'CHECKING',
        solutionText: dto.solutionText,
        updatedAt: new Date(),
      },
      create: {
        lessonId: dto.lessonId,
        studentId: userId,
        courseId: dto.courseId,
        solutionText: dto.solutionText,
        status: 'CHECKING',
      },
      include: {
        lesson: {
          select: {
            homeworkTask: true,
            homeworkSolution: true,
          },
        },
        student: { select: { name: true } },
        course: { select: { teacherId: true } },
      },
    })

    // Emit submission event immediately so teacher sees it as "Checking"
    this.eventEmitter.emit(
      'homework.submitted',
      new HomeworkSubmittedEvent(
        homework.id,
        userId,
        dto.courseId,
        homework.course.teacherId,
        homework.student?.name || 'Студент',
      ),
    )

    // Fetch execution logs for context (GPT-Buster logic)
    const executionLogs = await this.prisma.codeExecutionLog.findMany({
      where: { userId, lessonId: dto.lessonId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Trigger AI Check in background
    void this.runAICheck(
      homework.id,
      homework.studentId,
      dto.lessonId,
      homework.lesson.homeworkTask || '',
      dto.solutionText || '',
      homework.lesson.homeworkSolution || '',
      executionLogs,
    )

    return homework
  }

  private async runAICheck(
    homeworkId: string,
    studentId: string,
    lessonId: string,
    taskDescription: string,
    solutionText: string,
    referenceSolution?: string,
    executionLogs: Array<{
      createdAt: Date | string
      success: boolean
      output: string | null
      error: string | null
    }> = [],
  ): Promise<void> {
    try {
      this.logger.log(`Starting AI Check for homework ${homeworkId}`)
      const result = await this.aiService.reviewCodeWithGemini(solutionText, taskDescription)

      // BIG TECH LOGIC: Hybrid Intelligence triage
      const isCertain = result.confidence > 85 && result.integrityScore > 70
      const updateData = {
        confidenceScore: result.confidence,
        aiReasoning: result.reasoning,
        aiFeedbackDraft: result.feedback,
        aiScoreDraft: result.score,
        integrityScore: result.integrityScore,
        integrityReasoning: result.integrityReasoning,
        socraticHints: JSON.stringify(result.socraticHints),
        feedback: result.feedback,
        score: result.score,
        status: isCertain ? (result.status as 'COMPLETED' | 'REJECTED') : ('NEEDS_REVIEW' as const),
        isManualReviewRequired: !isCertain,
      }

      const updatedHomework = await this.prisma.homework.update({
        where: { id: homeworkId },
        data: updateData,
      })

      this.logger.log(
        `AI Check completed for ${homeworkId}: ${updateData.status} (Certainty: ${result.confidence}%, Integrity: ${result.integrityScore}%)`,
      )

      // EMIT EVENT (Decoupled Architecture)
      this.eventEmitter.emit(
        'homework.reviewed',
        new HomeworkReviewedEvent(
          homeworkId,
          studentId,
          lessonId,
          updatedHomework.status,
          updatedHomework.score,
          updatedHomework.feedback,
          isCertain,
        ),
      )
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      this.logger.error(`AI Check failed for homework ${homeworkId}: ${message}`)
      await this.prisma.homework
        .update({
          where: { id: homeworkId },
          data: {
            status: 'PENDING',
            feedback: 'ИИ-проверка временно недоступна. Ожидайте проверки преподавателем.',
          },
        })
        .catch((err: unknown) => {
          const resetMessage = err instanceof Error ? err.message : String(err)
          this.logger.error(
            `Critical: Failed to reset homework status ${homeworkId}: ${resetMessage}`,
          )
        })
    }
  }

  async getHomeworkStatus(userId: string, lessonId: string): Promise<Homework | null> {
    try {
      this.logger.log(`Fetching homework status for user ${userId}, lesson ${lessonId}`)
      const homework = await this.prisma.homework.findUnique({
        where: {
          lessonId_studentId: {
            lessonId,
            studentId: userId,
          },
        },
        include: {
          comments: {
            include: {
              author: {
                select: { id: true, name: true, avatar: true, role: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      })
      return homework
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      this.logger.error(`Error in getHomeworkStatus: ${message}`)
      // Returning null instead of throwing to prevent 500 error on the frontend
      return null
    }
  }

  async getHomeworkById(homeworkId: string, userId: string): Promise<Homework> {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
      include: {
        student: {
          select: { id: true, name: true, avatar: true },
        },
        lesson: {
          select: { id: true, title: true, homeworkTitle: true, homeworkTask: true },
        },
        course: {
          select: { teacherId: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, avatar: true, role: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!homework) throw new NotFoundException('Homework not found')

    // Ensure access
    if (homework.studentId !== userId && homework.course.teacherId !== userId) {
      throw new ForbiddenException('Access denied')
    }

    return homework as Homework
  }

  async getStudentHomeworks(studentId: string): Promise<
    Array<
      Partial<Homework> & {
        lesson: { id: string; title: string }
        course: { id: string; title: string }
        status: string
      }
    >
  > {
    // 1. Get all cohorts/courses the student is enrolled in
    const cohorts = await this.prisma.cohort.findMany({
      where: { students: { some: { id: studentId } } },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  where: {
                    AND: [{ homeworkTask: { not: null } }, { homeworkTask: { not: '' } }],
                  },
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    // 2. Get existing homework entries
    const existingHomeworks = await this.prisma.homework.findMany({
      where: { studentId },
      include: {
        lesson: { select: { id: true, title: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    type MergedHomework = Partial<Homework> & {
      lesson: { id: string; title: string }
      course: { id: string; title: string }
      status: string
    }

    const result: MergedHomework[] = []
    const seenLessonIds = new Set<string>()

    // 3. Merge: Prioritize existing homeworks, then add unstarted ones
    for (const h of existingHomeworks) {
      if (h.lesson && h.course) {
        result.push(h as MergedHomework)
        seenLessonIds.add(h.lessonId)
      }
    }

    for (const cohort of cohorts) {
      for (const module of cohort.course.modules) {
        for (const lesson of module.lessons) {
          if (!seenLessonIds.has(lesson.id)) {
            result.push({
              id: `virtual-${lesson.id}`,
              status: 'NOT_STARTED',
              studentId,
              courseId: cohort.course.id,
              lessonId: lesson.id,
              lesson: { id: lesson.id, title: lesson.title },
              course: { id: cohort.course.id, title: cohort.course.title },
              createdAt: new Date(),
              updatedAt: new Date(),
            } as MergedHomework)
            seenLessonIds.add(lesson.id)
          }
        }
      }
    }

    return result
  }

  async getPendingReviews(teacherId: string): Promise<Homework[]> {
    return this.prisma.homework.findMany({
      where: {
        isManualReviewRequired: true,
        course: {
          teacherId,
        },
      },
      include: {
        student: {
          select: { id: true, name: true, avatar: true },
        },
        lesson: {
          select: { id: true, title: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async updateStatus(
    homeworkId: string,
    teacherId: string,
    dto: UpdateHomeworkStatusDto,
  ): Promise<Homework> {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
      include: { course: true },
    })

    if (!homework) throw new NotFoundException('Homework not found')
    if (homework.course.teacherId !== teacherId) {
      throw new ForbiddenException('You are not the teacher of this course')
    }

    const updatedHomework = await this.prisma.homework.update({
      where: { id: homeworkId },
      data: {
        status: dto.status,
        score: dto.score,
        feedback: dto.feedback,
        isManualReviewRequired: false,
      },
    })

    // EMIT EVENT (Decoupled Architecture)
    if (dto.status === 'COMPLETED' && homework.status !== 'COMPLETED') {
      this.eventEmitter.emit(
        'homework.reviewed',
        new HomeworkReviewedEvent(
          homeworkId,
          homework.studentId,
          homework.lessonId,
          dto.status,
          dto.score,
          dto.feedback,
          true, // Teacher review is always "certain"
        ),
      )
    }

    return updatedHomework as Homework
  }

  async addComment(homeworkId: string, userId: string, dto: CreateCommentDto): Promise<Comment> {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
      include: { course: true },
    })

    if (!homework) throw new NotFoundException('Homework not found')

    // Check if user is either the student or the teacher of the course
    const isStudent = homework.studentId === userId
    const isTeacher = homework.course.teacherId === userId

    if (!isStudent && !isTeacher) {
      throw new ForbiddenException('Access denied')
    }

    const comment = await this.prisma.comment.create({
      data: {
        text: dto.text,
        homeworkId,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
    })

    // Determine recipient for notification
    const recipientId = isStudent ? homework.course.teacherId : homework.studentId

    // Emit event for real-time chat
    this.eventEmitter.emit(
      'homework.comment_added',
      new HomeworkCommentAddedEvent(
        homeworkId,
        comment.id,
        userId,
        comment.text,
        comment.author.name || 'Anonymous',
        recipientId,
      ),
    )

    return comment
  }

  async ensureChat(teacherId: string, studentId: string): Promise<{ homeworkId: string }> {
    try {
      // 1. First, check if there's ALREADY a homework/chat for this student in any of this teacher's courses
      const existingHomework = await this.prisma.homework.findFirst({
        where: {
          studentId,
          course: { teacherId },
        },
        orderBy: { updatedAt: 'desc' },
        select: { id: true },
      })

      if (existingHomework) {
        return { homeworkId: existingHomework.id }
      }

      // 2. If no homework exists, find a course and create a skeleton for the first lesson
      // We look for a cohort belonging to this teacher where the student is enrolled
      const enrollment = await this.prisma.cohort.findFirst({
        where: {
          course: { teacherId },
          students: { some: { id: studentId } },
        },
        select: {
          id: true,
          courseId: true,
          course: {
            select: {
              modules: {
                take: 1,
                orderBy: { order: 'asc' },
                select: {
                  lessons: {
                    take: 1,
                    orderBy: { order: 'asc' },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      })

      if (!enrollment) {
        throw new BadRequestException('Студент не записан на ваши курсы')
      }

      const lessonId = enrollment.course?.modules?.[0]?.lessons?.[0]?.id

      if (!lessonId) {
        throw new BadRequestException('В курсе пока нет уроков для создания чата')
      }

      const homework = await this.prisma.homework.create({
        data: {
          lessonId,
          studentId,
          courseId: enrollment.courseId,
          cohortId: enrollment.id,
          status: 'PENDING',
          solutionText: 'Чат инициирован преподавателем',
        },
      })

      return { homeworkId: homework.id }
    } catch (error) {
      this.logger.error(
        `[ensureChat] Failed for teacher ${teacherId}, student ${studentId}:`,
        error,
      )
      if (error instanceof BadRequestException) throw error
      throw new Error(
        `Не удалось создать чат: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
