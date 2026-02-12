import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { LevelUpEvent } from '../shared/events/level-up.event'

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name)

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async awardXp(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<{ levelUp: boolean; newLevel: number; newXp: number } | undefined> {
    this.logger.log(`Awarding ${amount} XP to user ${userId} for ${reason}`)

    const stats = await this.prisma.userStats.findUnique({
      where: { userId },
    })

    if (!stats) return

    const newXp = stats.xp + amount
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1

    const levelUp = newLevel > stats.level

    if (levelUp) {
      this.eventEmitter.emit('level.up', new LevelUpEvent(userId, newLevel))
    }

    await this.prisma.userStats.update({
      where: { userId },
      data: {
        xp: newXp,
        level: newLevel,
        lastActivityAt: new Date(),
      },
    })

    // Log activity
    await this.prisma.userActivity
      .create({
        data: {
          userId,
          type: 'XP_GAIN',
          points: amount,
        },
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err)
        this.logger.error(`Failed to create activity log: ${message}`)
      })

    return { levelUp, newLevel, newXp }
  }

  async checkStreak(userId: string): Promise<number | undefined> {
    const stats = await this.prisma.userStats.findUnique({
      where: { userId },
    })

    if (!stats) return

    const lastActivity = new Date(stats.lastActivityAt)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const activityDate = new Date(lastActivity)
    activityDate.setHours(0, 0, 0, 0)

    // If last activity was already today, don't increment streak again
    if (activityDate.getTime() === today.getTime()) {
      return stats.streak
    }

    let newStreak = stats.streak

    if (activityDate.getTime() === yesterday.getTime()) {
      newStreak += 1
    } else {
      // If it's not today and not yesterday, it's a gap -> reset to 1
      newStreak = 1
    }

    const longestStreak = Math.max(newStreak, stats.longestStreak)

    await this.prisma.userStats.update({
      where: { userId },
      data: {
        streak: newStreak,
        longestStreak,
        lastActivityAt: new Date(),
      },
    })

    return newStreak
  }
}
