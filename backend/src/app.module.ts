import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { CoursesModule } from './courses/courses.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { DashboardService } from './dashboard/dashboard.service'
import { DashboardController } from './dashboard/dashboard.controller'
import { TeacherModule } from './teacher/teacher.module'
import { BuilderModule } from './builder/builder.module'
import { UploadModule } from './upload/upload.module'
import { HomeworksModule } from './homeworks/homeworks.module'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'

import { RolesGuard } from './auth/roles.guard'

@Module({
  imports: [
    // ... imports same
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    CoursesModule,
    UsersModule,
    AuthModule,
    TeacherModule,
    BuilderModule,
    UploadModule,
    HomeworksModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    DashboardService,
  ],
})
export class AppModule { }
