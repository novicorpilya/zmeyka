import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(createCourseDto: CreateCourseDto) {
        return this.prisma.course.create({
            data: createCourseDto,
        });
    }

    async findAll() {
        return this.prisma.course.findMany({
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.course.findUnique({
            where: { id },
            include: {
                teacher: true,
                homeworks: true,
            },
        });
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        return this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
        });
    }

    async remove(id: string) {
        return this.prisma.course.delete({
            where: { id },
        });
    }
}
