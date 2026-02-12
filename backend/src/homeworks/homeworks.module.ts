import { Module } from '@nestjs/common'
import { HomeworksService } from './homeworks.service'
import { HomeworksController } from './homeworks.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { HomeworkGamificationListener } from './listeners/homework-gamification.listener'
import { HomeworkNotificationListener } from './listeners/homework-notification.listener'

@Module({
  imports: [PrismaModule],
  controllers: [HomeworksController],
  providers: [HomeworksService, HomeworkGamificationListener, HomeworkNotificationListener],
  exports: [HomeworksService],
})
export class HomeworksModule {}
