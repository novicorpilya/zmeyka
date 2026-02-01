import { CoursesService, CourseWithCalculatedProgress } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Course } from '@prisma/client';
import { AuthenticatedRequest } from '../shared/interfaces/request.interface';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto, req: AuthenticatedRequest): Promise<{
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
    findAll(req: AuthenticatedRequest): Promise<Course[]>;
    findOne(id: string, req: AuthenticatedRequest): Promise<CourseWithCalculatedProgress>;
    update(id: string, updateCourseDto: UpdateCourseDto, req: AuthenticatedRequest): Promise<{
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
    remove(id: string, req: AuthenticatedRequest): Promise<{
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
    private checkOwnership;
}
