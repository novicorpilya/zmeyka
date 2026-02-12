import { PrismaService } from '../prisma/prisma.service';
import { Course } from '@prisma/client';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
export interface LessonWithProgress {
    id: string;
    title: string;
    order: number;
    contentRich: string | null;
    videoUrl: string | null;
    chapters: string | null;
    isLocked?: boolean;
    isPreview?: boolean;
    progress?: Array<{
        isCompleted: boolean;
    }>;
}
export interface ModuleWithLessons {
    id: string;
    title: string;
    order: number;
    lessons: LessonWithProgress[];
}
export interface CourseWithCalculatedProgress {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    teacherId: string;
    progress: number;
    xp: number;
    calculatedProgress: number;
    calculatedXp: number;
    isPublished: boolean;
    isEnrolled?: boolean;
    studentsCount?: number;
    plannedLessonsCount: number;
    price: number;
    mentoringPrice: number;
    introVideoUrl: string | null;
    modules: ModuleWithLessons[];
    teacher: {
        name: string | null;
        avatar: string | null;
    };
}
export interface CourseSummary extends Course {
    studentsCount: number;
    price: number;
    mentoringPrice: number;
    introVideoUrl: string | null;
}
export declare class CoursesService {
    private prisma;
    private cacheManager;
    private eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, cacheManager: Cache, eventEmitter: EventEmitter2);
    create(createCourseDto: CreateCourseDto & {
        teacherId: string;
    }): Promise<Course>;
    findAll(onlyPublished?: boolean, userId?: string): Promise<CourseSummary[]>;
    findByTeacher(teacherId: string): Promise<CourseSummary[]>;
    findOne(id: string, userId?: string, checkVisibility?: boolean): Promise<CourseWithCalculatedProgress>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course>;
    checkOwnership(courseId: string, userId: string): Promise<void>;
    remove(id: string): Promise<Course>;
    enroll(courseId: string, userId: string): Promise<{
        id: string;
        email: string;
        name: string | null;
    }>;
    completeLesson(userId: string, lessonId: string): Promise<{
        userId: string;
        lessonId: string;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    claimOwnership(courseId: string, userId: string): Promise<Course>;
    search(query: string): Promise<{
        courses: Array<{
            id: string;
            title: string;
            thumbnail: string | null;
            teacher: {
                name: string | null;
            };
        }>;
        lessons: Array<{
            id: string;
            title: string;
            homeworkTitle: string | null;
            module: {
                title: string;
                course: {
                    id: string;
                    title: string;
                    thumbnail: string | null;
                };
            };
        }>;
    }>;
}
