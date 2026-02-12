import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { HomeworkReviewedEvent } from '../../shared/events/homework-reviewed.event'
import { GamificationService } from '../../gamification/gamification.service'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class HomeworkGamificationListener {
  private readonly logger = new Logger(HomeworkGamificationListener.name)

  constructor(
    private gamification: GamificationService,
    private prisma: PrismaService,
  ) {}

  @OnEvent('homework.reviewed')
  async handleHomeworkReviewed(event: HomeworkReviewedEvent): Promise<void> {
    this.logger.log(`Handling gamification for homework ${event.homeworkId}`)

    if (event.status === 'COMPLETED') {
      // 1. Award XP and check streaks
      await this.gamification.awardXp(event.studentId, event.score || 50, 'HOMEWORK_COMPLETED')
      await this.gamification.checkStreak(event.studentId)

      // 2. Auto-complete lesson progress
      await this.prisma.userProgress
        .upsert({
          where: { userId_lessonId: { userId: event.studentId, lessonId: event.lessonId } },
          update: { isCompleted: true, completedAt: new Date() },
          create: {
            userId: event.studentId,
            lessonId: event.lessonId,
            isCompleted: true,
            completedAt: new Date(),
          },
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err)
          this.logger.error(`Failed to auto-complete lesson ${event.lessonId}: ${message}`)
        })
    }
  }
}
