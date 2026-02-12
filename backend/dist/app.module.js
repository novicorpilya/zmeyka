"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const courses_module_1 = require("./courses/courses.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const teacher_module_1 = require("./teacher/teacher.module");
const builder_module_1 = require("./builder/builder.module");
const upload_module_1 = require("./upload/upload.module");
const homeworks_module_1 = require("./homeworks/homeworks.module");
const ai_module_1 = require("./ai/ai.module");
const execution_module_1 = require("./execution/execution.module");
const gamification_module_1 = require("./gamification/gamification.module");
const certificates_module_1 = require("./certificates/certificates.module");
const cohorts_module_1 = require("./cohorts/cohorts.module");
const payments_module_1 = require("./payments/payments.module");
const notifications_module_1 = require("./notifications/notifications.module");
const nestjs_pino_1 = require("nestjs-pino");
const throttler_1 = require("@nestjs/throttler");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const shared_module_1 = require("./shared/shared.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const roles_guard_1 = require("./auth/roles.guard");
const env_validation_1 = require("./env.validation");
const token_version_guard_1 = require("./auth/token-version.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: env_validation_1.envValidationSchema,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 10,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 50,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 200,
                },
            ]),
            prisma_module_1.PrismaModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            courses_module_1.CoursesModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            teacher_module_1.TeacherModule,
            builder_module_1.BuilderModule,
            upload_module_1.UploadModule,
            homeworks_module_1.HomeworksModule,
            ai_module_1.AIModule,
            execution_module_1.ExecutionModule,
            gamification_module_1.GamificationModule,
            certificates_module_1.CertificatesModule,
            cohorts_module_1.CohortsModule,
            payments_module_1.PaymentsModule,
            dashboard_module_1.DashboardModule,
            notifications_module_1.NotificationsModule,
            shared_module_1.SharedModule,
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    customProps: () => ({
                        context: 'HTTP',
                    }),
                    transport: process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty', options: { colorize: true } }
                        : undefined,
                },
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async (configService) => {
                    const redisHost = configService.get('REDIS_HOST');
                    if (!redisHost && process.env.NODE_ENV !== 'production') {
                        return {
                            ttl: 600,
                        };
                    }
                    try {
                        const store = await (0, cache_manager_redis_yet_1.redisStore)({
                            socket: {
                                host: redisHost || 'localhost',
                                port: parseInt(configService.get('REDIS_PORT') || '6379'),
                            },
                            ttl: 600,
                        });
                        return { store };
                    }
                    catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        console.error(`Failed to connect to Redis, falling back to in-memory cache: ${message}`);
                        return {
                            ttl: 600,
                        };
                    }
                },
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: token_version_guard_1.TokenVersionGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map