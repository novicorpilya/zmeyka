import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Subject, Observable } from 'rxjs'

export interface NotificationPayload {
  id: string
  type: string
  title: string
  message: string
  link?: string
  createdAt: Date
  read: boolean
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)
  private userStreams = new Map<string, Subject<NotificationPayload>>()

  constructor(private prisma: PrismaService) {}

  subscribe(userId: string): Observable<NotificationPayload> {
    let stream = this.userStreams.get(userId)
    if (!stream) {
      stream = new Subject<NotificationPayload>()
      this.userStreams.set(userId, stream)
    }
    return stream.asObservable()
  }

  async notify(
    userId: string,
    data: { type: string; title: string; message: string; link?: string },
  ) {
    try {
      const notification = await (this.prisma as any).notification.create({
        data: {
          userId,
          type: data.type,
          title: data.title,
          message: data.message,
          link: data.link,
        },
      })

      const stream = this.userStreams.get(userId)
      if (stream) {
        stream.next({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link || undefined,
          createdAt: notification.createdAt,
          read: notification.read,
        })
      }

      return notification
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.logger.error(`Failed to send notification to user ${userId}: ${message}`)
    }
  }

  async getRecent(userId: string, limit = 20) {
    try {
      const takeLimit = limit === undefined || isNaN(Number(limit)) ? 20 : Number(limit)
      return await (this.prisma as any).notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: takeLimit,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.logger.error(`Failed to fetch notifications for user ${userId}: ${message}`)
      throw error
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    return (this.prisma as any).notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    })
  }

  async markAllAsRead(userId: string) {
    return (this.prisma as any).notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  }
}
