import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe, Logger } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  // Security: Global Prefix
  app.setGlobalPrefix('api')

  // Global Validation: Senior configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Global Exception Filter for standardized errors
  app.useGlobalFilters(new GlobalExceptionFilter())

  // Strict CORS: Don't use origin: true in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Senior AI Course Platform API')
    .setDescription('High-performance API for AI education')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)

  logger.log(`🚀 Backend is running on: http://localhost:${port}/api`)
  logger.log(`📝 Swagger docs: http://localhost:${port}/docs`)
}
bootstrap()
