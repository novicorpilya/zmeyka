import { Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { NotificationListeners } from './notification.listeners'

@Module({
  providers: [NotificationsService, NotificationListeners],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
