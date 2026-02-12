"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const Sentry = require("@sentry/nestjs");
const profiling_node_1 = require("@sentry/profiling-node");
const cookieParser = require("cookie-parser");
const helmet_1 = require("helmet");
const global_exception_filter_1 = require("./shared/filters/global-exception.filter");
async function bootstrap() {
    const sentryDsn = process.env.SENTRY_DSN;
    if (sentryDsn) {
        Sentry.init({
            dsn: sentryDsn,
            integrations: [(0, profiling_node_1.nodeProfilingIntegration)()],
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
            profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
        });
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    app.enableShutdownHooks();
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false,
    }));
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            return new common_1.BadRequestException(errors);
        },
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
    const allowedOrigins = allowedOriginsEnv
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    if (allowedOrigins.includes('*')) {
        throw new Error('SECURITY: Wildcard CORS is NOT allowed with credentials');
    }
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Змейка AI Platform API')
        .setDescription('High-performance API for AI education')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    const loggerInstance = app.get(nestjs_pino_1.Logger);
    loggerInstance.log(`🚀 Backend is running on: http://localhost:${port}/api`);
    loggerInstance.log(`📝 Swagger docs: http://localhost:${port}/docs`);
}
void bootstrap();
//# sourceMappingURL=main.js.map