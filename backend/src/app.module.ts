import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { CoursesModule } from './courses/courses.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { DashboardModule } from './dashboard/dashboard.module'
import { TeacherModule } from './teacher/teacher.module'
import { BuilderModule } from './builder/builder.module'
import { UploadModule } from './upload/upload.module'
import { HomeworksModule } from './homeworks/homeworks.module'
import { AIModule } from './ai/ai.module'
import { ExecutionModule } from './execution/execution.module'
import { GamificationModule } from './gamification/gamification.module'
import { CertificatesModule } from './certificates/certificates.module'
import { CohortsModule } from './cohorts/cohorts.module'
import { PaymentsModule } from './payments/payments.module'
import { NotificationsModule } from './notifications/notifications.module'
import { LoggerModule } from 'nestjs-pino'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
import { SharedModule } from './shared/shared.module'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { RolesGuard } from './auth/roles.guard'
import { envValidationSchema } from './env.validation'
import { TokenVersionGuard } from './auth/token-version.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10, // Increased from 3
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50, // Increased from 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200, // Increased from 100
      },
    ]),
    PrismaModule,
    EventEmitterModule.forRoot(),
    CoursesModule,
    UsersModule,
    AuthModule,
    TeacherModule,
    BuilderModule,
    UploadModule,
    HomeworksModule,
    AIModule,
    ExecutionModule,
    GamificationModule,
    CertificatesModule,
    CohortsModule,
    PaymentsModule,
    DashboardModule,
    NotificationsModule,
    SharedModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (): Record<string, string> => ({
          context: 'HTTP',
        }),
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: async (configService: ConfigService): Promise<any> => {
        const redisHost = configService.get<string>('REDIS_HOST')
        if (!redisHost && process.env.NODE_ENV !== 'production') {
          return {
            ttl: 600, // 10 minutes cache
          }
        }

        try {
          const store = await redisStore({
            socket: {
              host: redisHost || 'localhost',
              port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
            },
            ttl: 600,
          })
          return { store }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error)
          // eslint-disable-next-line no-console
          console.error(`Failed to connect to Redis, falling back to in-memory cache: ${message}`)
          return {
            ttl: 600,
          }
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
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
    {
      provide: APP_GUARD,
      useClass: TokenVersionGuard,
    },
  ],
})
export class AppModule {}
