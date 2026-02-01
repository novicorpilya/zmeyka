"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const progress_util_1 = require("../shared/utils/progress.util");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCourseDto) {
        return this.prisma.course.create({
            data: createCourseDto,
        });
    }
    async findAll(onlyPublished = true) {
        return this.prisma.course.findMany({
            where: onlyPublished ? { isPublished: true } : {},
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
    }
    async findOne(id, userId, checkVisibility = false) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: { name: true, avatar: true },
                },
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                            include: {
                                progress: userId
                                    ? {
                                        where: { userId },
                                    }
                                    : false,
                            },
                        },
                    },
                },
            },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (checkVisibility && !course.isPublished) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (!userId) {
            return {
                ...course,
                isPublished: course.isPublished,
                progress: 0,
                xp: 0,
                calculatedProgress: 0,
                calculatedXp: 0,
                modules: course.modules.map((m) => ({
                    ...m,
                    lessons: m.lessons.map((l) => ({ ...l, progress: [] })),
                })),
            };
        }
        const { progress, xp } = progress_util_1.ProgressUtil.calculateProgress(course.modules, userId);
        return {
            ...course,
            isPublished: course.isPublished,
            progress,
            xp,
            calculatedProgress: progress,
            calculatedXp: xp,
        };
    }
    async update(id, updateCourseDto) {
        return this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
        });
    }
    async remove(id) {
        return this.prisma.course.delete({
            where: { id },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map