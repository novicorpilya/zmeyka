import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CoursesService, CourseWithCalculatedProgress } from './courses.service'
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { Role, Course } from '@prisma/client'
import { AuthenticatedRequest, UserPayload } from '../shared/interfaces/request.interface'

@ApiTags('courses')
@Controller('courses')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new course' })
  async create(@Body() createCourseDto: CreateCourseDto, @Req() req: AuthenticatedRequest) {
    return this.coursesService.create({ ...createCourseDto, teacherId: req.user.id })
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  async findAll(@Req() req: AuthenticatedRequest): Promise<Course[]> {
    const onlyPublished = req.user.role === Role.STUDENT
    return this.coursesService.findAll(onlyPublished)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by id' })
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CourseWithCalculatedProgress> {
    const checkVisibility = req.user.role === Role.STUDENT
    return this.coursesService.findOne(id, req.user.id, checkVisibility)
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update course' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.checkOwnership(id, req.user)
    return this.coursesService.update(id, updateCourseDto)
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete course' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.checkOwnership(id, req.user)
    return this.coursesService.remove(id)
  }

  private async checkOwnership(courseId: string, user: UserPayload) {
    if (user.role === Role.ADMIN) return
    const course = await this.coursesService.findOne(courseId)
    if (course.teacherId !== user.id) {
      throw new ForbiddenException('You do not own this course')
    }
  }
}
