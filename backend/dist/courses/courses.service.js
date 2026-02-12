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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CoursesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const progress_util_1 = require("../shared/utils/progress.util");
const cache_manager_1 = require("@nestjs/cache-manager");
const course_enrolled_event_1 = require("../shared/events/course-enrolled.event");
const event_emitter_1 = require("@nestjs/event-emitter");
let CoursesService = CoursesService_1 = class CoursesService {
    constructor(prisma, cacheManager, eventEmitter) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(CoursesService_1.name);
    }
    async create(createCourseDto) {
        const course = await this.prisma.course.create({
            data: createCourseDto,
        });
        await this.cacheManager.del(`teacher_dashboard_${createCourseDto.teacherId}`);
        return course;
    }
    async findAll(onlyPublished = true, userId) {
        this.logger.log(`[findAll] userId: ${userId}, onlyPublished: ${onlyPublished}`);
        let whereClause = {};
        if (!userId) {
            whereClause = { isPublished: true };
        }
        else {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (user && (user.role === 'TEACHER' || user.role === 'ADMIN')) {
                whereClause = {};
            }
            else {
                whereClause = {
                    OR: [
                        { isPublished: true },
                        { cohorts: { some: { students: { some: { id: userId } } } } },
                    ],
                };
            }
        }
        const courses = await this.prisma.course.findMany({
            where: whereClause,
            include: {
                teacher: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        return Promise.all(courses.map(async (course) => {
            const studentsCount = await this.prisma.user.count({
                where: {
                    OR: [
                        { cohorts: { some: { courseId: course.id } } },
                        { progress: { some: { lesson: { module: { courseId: course.id } } } } },
                    ],
                },
            });
            const c = course;
            return {
                ...c,
                price: c.price,
                mentoringPrice: c.mentoringPrice,
                studentsCount,
            };
        }));
    }
    async findByTeacher(teacherId) {
        const courses = await this.prisma.course.findMany({
            where: { teacherId, isPublished: true },
            include: {
                teacher: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        return Promise.all(courses.map(async (course) => {
            const studentsCount = await this.prisma.user.count({
                where: {
                    OR: [
                        { cohorts: { some: { courseId: course.id } } },
                        { progress: { some: { lesson: { module: { courseId: course.id } } } } },
                    ],
                },
            });
            const c = course;
            return {
                ...c,
                price: c.price,
                mentoringPrice: c.mentoringPrice,
                studentsCount,
            };
        }));
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
                            select: {
                                id: true,
                                title: true,
                                content: true,
                                contentRich: true,
                                conspectusFile: true,
                                videoUrl: true,
                                homeworkTitle: true,
                                homeworkTask: true,
                                homeworkFile: true,
                                trinketUrl: true,
                                chapters: true,
                                order: true,
                                moduleId: true,
                                isPreview: true,
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
        const c = course;
        const studentsCount = await this.prisma.user.count({
            where: {
                OR: [
                    { cohorts: { some: { courseId: c.id } } },
                    { progress: { some: { lesson: { module: { courseId: c.id } } } } },
                ],
            },
        });
        if (checkVisibility && !c.isPublished) {
            throw new common_1.NotFoundException('Course not found');
        }
        const isEnrolled = userId
            ? (await this.prisma.user.count({
                where: { id: userId, cohorts: { some: { courseId: id } } },
            })) > 0
            : false;
        let isPreviousCompleted = true;
        const modulesWithLocking = c.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((lesson) => {
                const lessonObj = lesson;
                const isCompleted = lessonObj.progress &&
                    Array.isArray(lessonObj.progress) &&
                    lessonObj.progress.length > 0 &&
                    lessonObj.progress[0].isCompleted;
                const isLocked = !isPreviousCompleted && !lessonObj.isPreview;
                isPreviousCompleted = !!isCompleted || isEnrolled === false;
                return {
                    ...lessonObj,
                    isLocked: isLocked && !isCompleted,
                };
            }),
        }));
        if (!userId) {
            return {
                ...c,
                isPublished: c.isPublished,
                progress: 0,
                xp: 0,
                calculatedProgress: 0,
                calculatedXp: 0,
                price: c.price,
                mentoringPrice: c.mentoringPrice,
                introVideoUrl: c.introVideoUrl,
                isEnrolled: false,
                studentsCount,
                modules: modulesWithLocking,
                teacher: c.teacher,
            };
        }
        const { progress, xp } = progress_util_1.ProgressUtil.calculateProgress(c.modules, userId);
        return {
            ...c,
            isPublished: c.isPublished,
            progress,
            xp,
            calculatedProgress: progress,
            calculatedXp: xp,
            price: c.price,
            mentoringPrice: c.mentoringPrice,
            introVideoUrl: c.introVideoUrl,
            isEnrolled,
            studentsCount,
            modules: modulesWithLocking,
            teacher: c.teacher,
        };
    }
    async update(id, updateCourseDto) {
        const course = await this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
        });
        await this.cacheManager.del(`teacher_dashboard_${course.teacherId}`);
        return course;
    }
    async checkOwnership(courseId, userId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            select: { teacherId: true },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.teacherId !== userId) {
            throw new common_1.ForbiddenException('You do not own this course');
        }
    }
    async remove(id) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (course) {
            await this.cacheManager.del(`teacher_dashboard_${course.teacherId}`);
        }
        return this.prisma.course.delete({
            where: { id },
        });
    }
    async enroll(courseId, userId) {
        return this.prisma.$transaction(async (tx) => {
            const course = await tx.course.findUnique({
                where: { id: courseId },
                include: {
                    cohorts: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                },
            });
            if (!course)
                throw new common_1.NotFoundException('Course not found');
            let targetCohortId = course.cohorts[0]?.id;
            if (!targetCohortId) {
                const newCohort = await tx.cohort.create({
                    data: {
                        name: 'Первый поток (Авто)',
                        courseId: courseId,
                    },
                });
                targetCohortId = newCohort.id;
            }
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    cohorts: { connect: { id: targetCohortId } },
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
            this.eventEmitter.emit('course.enrolled', new course_enrolled_event_1.CourseEnrolledEvent(userId, courseId, course.title, course.teacherId, user.name || 'Студент'));
            return user;
        });
    }
    async completeLesson(userId, lessonId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: true },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const progress = await this.prisma.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            update: {
                isCompleted: true,
                completedAt: new Date(),
            },
            create: {
                userId,
                lessonId,
                isCompleted: true,
                completedAt: new Date(),
            },
        });
        return progress;
    }
    async claimOwnership(courseId, userId) {
        return this.prisma.course.update({
            where: { id: courseId },
            data: { teacherId: userId },
        });
    }
    async search(query) {
        if (!query)
            return { courses: [], lessons: [] };
        const courses = await this.prisma.course.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
                isPublished: true,
            },
            take: 5,
            select: {
                id: true,
                title: true,
                thumbnail: true,
                teacher: { select: { name: true } },
            },
        });
        const lessons = await this.prisma.lesson.findMany({
            where: {
                title: { contains: query, mode: 'insensitive' },
                module: { course: { isPublished: true } },
            },
            take: 5,
            select: {
                id: true,
                title: true,
                homeworkTitle: true,
                module: {
                    select: {
                        title: true,
                        course: {
                            select: {
                                id: true,
                                title: true,
                                thumbnail: true,
                            },
                        },
                    },
                },
            },
        });
        return { courses, lessons };
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = CoursesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, event_emitter_1.EventEmitter2])
], CoursesService);
//# sourceMappingURL=courses.service.js.map