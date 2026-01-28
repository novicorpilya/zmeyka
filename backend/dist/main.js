"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Senior AI Course Platform API')
        .setDescription('The API documentation for the AI Course Platform')
        .setVersion('1.0')
        .addTag('courses', 'Operations related to courses')
        .addTag('default', 'General operations')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`\n🚀 Backend is running on: http://localhost:${port}/api`);
    console.log(`📝 Swagger docs: http://localhost:${port}/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map