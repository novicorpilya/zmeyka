import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SubmitHomeworkDto, UpdateHomeworkStatusDto } from './dto/homework.dto'
import { CreateCommentDto } from './dto/comment.dto'
import { Homework, Comment } from '@prisma/client'

@Injectable()
export class HomeworksService {
  constructor(private prisma: PrismaService) { }

  async submitHomework(userId: string, dto: SubmitHomeworkDto): Promise<Homework> {
    return this.prisma.homework.upsert({
      where: {
        lessonId_studentId: {
          lessonId: dto.lessonId,
          studentId: userId,
        },
      },
      update: {
        status: 'PENDING',
        solutionText: dto.solutionText,
        updatedAt: new Date(),
      },
      create: {
        lessonId: dto.lessonId,
        studentId: userId,
        courseId: dto.courseId,
        solutionText: dto.solutionText,
        status: 'PENDING',
      },
    })
  }

  async getHomeworkStatus(userId: string, lessonId: string): Promise<Homework | null> {
    return this.prisma.homework.findUnique({
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

    return homework as unknown as Homework
  }

  async updateStatus(homeworkId: string, teacherId: string, dto: UpdateHomeworkStatusDto): Promise<Homework> {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
      include: { course: true },
    })

    if (!homework) throw new NotFoundException('Homework not found')
    if (homework.course.teacherId !== teacherId) {
      throw new ForbiddenException('You are not the teacher of this course')
    }

    return this.prisma.homework.update({
      where: { id: homeworkId },
      data: {
        status: dto.status,
        score: dto.score,
        feedback: dto.feedback,
      },
    })
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

    return this.prisma.comment.create({
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
  }
}
