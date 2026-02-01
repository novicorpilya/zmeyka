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
const dashboard_service_1 = require("./dashboard/dashboard.service");
const dashboard_controller_1 = require("./dashboard/dashboard.controller");
const teacher_module_1 = require("./teacher/teacher.module");
const builder_module_1 = require("./builder/builder.module");
const upload_module_1 = require("./upload/upload.module");
const homeworks_module_1 = require("./homeworks/homeworks.module");
const throttler_1 = require("@nestjs/throttler");
const roles_guard_1 = require("./auth/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            prisma_module_1.PrismaModule,
            courses_module_1.CoursesModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            teacher_module_1.TeacherModule,
            builder_module_1.BuilderModule,
            upload_module_1.UploadModule,
            homeworks_module_1.HomeworksModule,
        ],
        controllers: [app_controller_1.AppController, dashboard_controller_1.DashboardController],
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
            dashboard_service_1.DashboardService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map