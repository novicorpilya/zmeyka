import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe, BadRequestException } from '@nestjs/common'
import { Logger } from 'nestjs-pino'
import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter'

async function bootstrap(): Promise<void> {
  // Sentry: Initialize only when DSN is configured
  const sentryDsn = process.env.SENTRY_DSN
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    })
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  app.useLogger(app.get(Logger))

  // Enable Graceful Shutdown for production
  app.enableShutdownHooks()

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  )
  app.use(cookieParser())

  // Security: Global Prefix
  app.setGlobalPrefix('api')

  // Global Validation: Senior configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors): BadRequestException => {
        return new BadRequestException(errors)
      },
    }),
  )

  // Global Exception Filter for standardized errors
  app.useGlobalFilters(new GlobalExceptionFilter())

  // Strict CORS: Don't use origin: true in production
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
  const allowedOrigins = allowedOriginsEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  // Security Check: Ensure we don't accidentally allow * with credentials
  if (allowedOrigins.includes('*')) {
    throw new Error('SECURITY: Wildcard CORS is NOT allowed with credentials')
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Змейка AI Platform API')
    .setDescription('High-performance API for AI education')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)

  const loggerInstance = app.get(Logger)
  loggerInstance.log(`🚀 Backend is running on: http://localhost:${port}/api`)
  loggerInstance.log(`📝 Swagger docs: http://localhost:${port}/docs`)
}
void bootstrap()
