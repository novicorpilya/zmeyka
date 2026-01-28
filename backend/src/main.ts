import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Prefix all routes with /api
    app.setGlobalPrefix('api');

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // Enable CORS for frontend
    app.enableCors();

    // Swagger Setup
    const config = new DocumentBuilder()
        .setTitle('Senior AI Course Platform API')
        .setDescription('The API documentation for the AI Course Platform')
        .setVersion('1.0')
        .addTag('courses', 'Operations related to courses')
        .addTag('default', 'General operations')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`\n🚀 Backend is running on: http://localhost:${port}/api`);
    console.log(`📝 Swagger docs: http://localhost:${port}/docs\n`);
}
bootstrap();
