import { CoursesService, CourseWithCalculatedProgress, CourseSummary } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Course } from '@prisma/client';
import { AuthenticatedRequest } from '../shared/interfaces/request.interface';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto, req: AuthenticatedRequest): Promise<Course>;
    findAll(req: AuthenticatedRequest): Promise<CourseSummary[]>;
    search(q: string): Promise<{
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
    findByTeacher(teacherId: string): Promise<CourseSummary[]>;
    findOne(id: string, req: AuthenticatedRequest): Promise<CourseWithCalculatedProgress>;
    update(id: string, updateCourseDto: UpdateCourseDto, req: AuthenticatedRequest): Promise<Course>;
    remove(id: string, req: AuthenticatedRequest): Promise<Course>;
    enroll(id: string, req: AuthenticatedRequest): Promise<{
        id: string;
        email: string;
        name: string | null;
    }>;
    completeLesson(lessonId: string, req: AuthenticatedRequest): Promise<{
        userId: string;
        lessonId: string;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    private checkOwnership;
}
