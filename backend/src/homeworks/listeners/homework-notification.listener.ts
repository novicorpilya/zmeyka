import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { HomeworkReviewedEvent } from '../../shared/events/homework-reviewed.event'
import { HomeworkCommentAddedEvent } from '../../shared/events/homework-comment-added.event'
import { HomeworkSubmittedEvent } from '../../shared/events/homework-submitted.event'
import { EventsGateway } from '../../shared/gateways/events.gateway'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Inject } from '@nestjs/common'

@Injectable()
export class HomeworkNotificationListener {
  private readonly logger = new Logger(HomeworkNotificationListener.name)

  constructor(
    private eventsGateway: EventsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @OnEvent('homework.submitted')
  async handleHomeworkSubmitted(event: HomeworkSubmittedEvent): Promise<void> {
    this.logger.log(
      `Homework ${event.homeworkId} submitted by ${event.studentName}. Notifying teacher ${event.teacherId}`,
    )

    // Invalidate teacher dashboard cache so they see the new item
    const cacheKey = `teacher_dashboard_${event.teacherId}`
    await this.cacheManager
      .del(cacheKey)
      .catch((e) => this.logger.warn(`Failed to clear cache: ${e}`))

    // Notify teacher via WebSocket
    this.eventsGateway.sendToUser(event.teacherId, 'homework_submitted', {
      homeworkId: event.homeworkId,
      studentName: event.studentName,
    })
  }

  @OnEvent('homework.reviewed')
  async handleHomeworkReviewed(event: HomeworkReviewedEvent): Promise<void> {
    this.logger.log(
      `Sending notification for homework ${event.homeworkId} to user ${event.studentId}`,
    )

    this.eventsGateway.sendToUser(event.studentId, 'homework_reviewed', {
      homeworkId: event.homeworkId,
      status: event.status,
      score: event.score,
      feedback: event.feedback,
    })
  }

  @OnEvent('homework.comment_added')
  handleHomeworkCommentAdded(event: HomeworkCommentAddedEvent): void {
    this.logger.log(
      `Sending new comment notification for homework ${event.homeworkId} to recipient ${event.recipientId}`,
    )

    this.eventsGateway.sendToUser(event.recipientId, 'new_comment', {
      homeworkId: event.homeworkId,
      commentId: event.commentId,
      authorId: event.authorId,
      authorName: event.authorName,
      text: event.text,
    })
  }
}
