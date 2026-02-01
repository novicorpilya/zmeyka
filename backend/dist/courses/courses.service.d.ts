import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
export interface LessonWithProgress {
    id: string;
    title: string;
    order: number;
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
    modules: ModuleWithLessons[];
    teacher: {
        name: string | null;
        avatar: string | null;
    };
}
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseDto: CreateCourseDto & {
        teacherId: string;
    }): Promise<{
        description: string | null;
        title: string;
        category: string | null;
        level: string | null;
        isPublished: boolean;
        id: string;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
    }>;
    findAll(onlyPublished?: boolean): Promise<({
        teacher: {
            name: string | null;
            id: string;
            email: string;
            avatar: string | null;
        };
    } & {
        description: string | null;
        title: string;
        category: string | null;
        level: string | null;
        isPublished: boolean;
        id: string;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
    })[]>;
    findOne(id: string, userId?: string, checkVisibility?: boolean): Promise<CourseWithCalculatedProgress>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<{
        description: string | null;
        title: string;
        category: string | null;
        level: string | null;
        isPublished: boolean;
        id: string;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        title: string;
        category: string | null;
        level: string | null;
        isPublished: boolean;
        id: string;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
    }>;
}
