import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseDto: CreateCourseDto): Promise<{
        description: string | null;
        title: string;
        videoUrls: string;
        quizzes: string;
        teacherId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        teacher: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        description: string | null;
        title: string;
        videoUrls: string;
        quizzes: string;
        teacherId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        teacher: {
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        homeworks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            score: number | null;
            feedback: string | null;
            courseId: string;
            studentId: string;
        }[];
    } & {
        description: string | null;
        title: string;
        videoUrls: string;
        quizzes: string;
        teacherId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<{
        description: string | null;
        title: string;
        videoUrls: string;
        quizzes: string;
        teacherId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        title: string;
        videoUrls: string;
        quizzes: string;
        teacherId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
