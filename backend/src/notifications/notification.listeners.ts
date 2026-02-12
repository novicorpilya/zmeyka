import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { NotificationsService } from './notifications.service'
import { HomeworkSubmittedEvent } from '../shared/events/homework-submitted.event'
import { HomeworkReviewedEvent } from '../shared/events/homework-reviewed.event'
import { HomeworkCommentAddedEvent } from '../shared/events/homework-comment-added.event'
import { CourseEnrolledEvent } from '../shared/events/course-enrolled.event'
import { LevelUpEvent } from '../shared/events/level-up.event'

@Injectable()
export class NotificationListeners implements OnModuleInit {
  private readonly logger = new Logger(NotificationListeners.name)

  constructor(private notificationsService: NotificationsService) {}

  onModuleInit() {
    this.logger.log('Notification Listeners Initialized')
  }

  @OnEvent('homework.submitted')
  async handleHomeworkSubmitted(event: HomeworkSubmittedEvent) {
    await this.notificationsService.notify(event.teacherId, {
      type: 'ASSIGNMENT',
      title: 'Новая работа 📝',
      message: `Студент ${event.studentName} сдал работу по курсу.`,
      link: `/homework/${event.homeworkId}`,
    })
  }

  @OnEvent('homework.reviewed')
  async handleHomeworkReviewed(event: HomeworkReviewedEvent) {
    const statusEmoji = event.status === 'COMPLETED' ? '✅' : '❌'
    const statusText = event.status === 'COMPLETED' ? 'принята' : 'отклонена'

    await this.notificationsService.notify(event.studentId, {
      type: 'ASSIGNMENT',
      title: `Работа ${statusText} ${statusEmoji}`,
      message: `Ваша домашняя работа была проверена ${event.isCertain ? 'ИИ' : 'преподавателем'}.`,
      link: `/homework/${event.homeworkId}`,
    })
  }

  @OnEvent('homework.comment_added')
  async handleHomeworkCommentAdded(event: HomeworkCommentAddedEvent) {
    await this.notificationsService.notify(event.recipientId, {
      type: 'COMMENT',
      title: 'Новое сообщение 💬',
      message: `${event.authorName}: ${event.text.substring(0, 50)}${event.text.length > 50 ? '...' : ''}`,
      link: `/homework/${event.homeworkId}`,
    })
  }

  @OnEvent('course.enrolled')
  async handleCourseEnrolled(event: CourseEnrolledEvent) {
    // Уведомление студенту
    await this.notificationsService.notify(event.userId, {
      type: 'SUCCESS',
      title: 'Успешная запись! 🎓',
      message: `Вы записались на курс "${event.courseTitle}". Приятного обучения!`,
      link: `/courses/${event.courseId}`,
    })

    // Уведомление учителю
    await this.notificationsService.notify(event.teacherId, {
      type: 'INFO',
      title: 'Новый студент! 👤',
      message: `Студент ${event.studentName} записался на ваш курс "${event.courseTitle}".`,
      link: `/courses/${event.courseId}`, // or teacher dashboard
    })
  }

  @OnEvent('level.up')
  async handleLevelUp(event: LevelUpEvent) {
    await this.notificationsService.notify(event.userId, {
      type: 'SUCCESS',
      title: 'Новый уровень! ✨',
      message: `Поздравляем! Вы достигли ${event.newLevel} уровня. Продолжайте в том же духе!`,
      link: '/analytics',
    })
  }
}
