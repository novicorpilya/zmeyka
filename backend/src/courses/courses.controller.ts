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
  Query,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CoursesService, CourseWithCalculatedProgress, CourseSummary } from './courses.service'
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto'
import { Public } from '../auth/public.decorator'
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
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Course> {
    return this.coursesService.create({ ...createCourseDto, teacherId: req.user.id })
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  async findAll(@Req() req: AuthenticatedRequest): Promise<CourseSummary[]> {
    const onlyPublished = !req.user || req.user.role === Role.STUDENT
    // Logic: If Student, they see Published OR Their Own (if they somehow created it).
    // If Teacher/Admin, onlyPublished is false, so they see Everything (or could be scoped if needed).
    // Passing req.user?.id allows the service to include "My Drafts" even if onlyPublished is true.
    return this.coursesService.findAll(onlyPublished, req.user?.id)
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search courses and lessons' })
  async search(@Query('q') q: string) {
    return this.coursesService.search(q || '')
  }

  @Public()
  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get courses by teacher id' })
  async findByTeacher(@Param('teacherId') teacherId: string): Promise<CourseSummary[]> {
    return this.coursesService.findByTeacher(teacherId)
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get course by id' })
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CourseWithCalculatedProgress> {
    const userId = req.user?.id
    const checkVisibility = !req.user || req.user.role === Role.STUDENT
    return this.coursesService.findOne(id, userId, checkVisibility)
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update course' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Course> {
    await this.checkOwnership(id, req.user)
    return this.coursesService.update(id, updateCourseDto)
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete course' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<Course> {
    await this.checkOwnership(id, req.user)
    return this.coursesService.remove(id)
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll in a course' })
  async enroll(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ id: string; email: string; name: string | null }> {
    return this.coursesService.enroll(id, req.user.id)
  }

  @Post('lessons/:lessonId/complete')
  @ApiOperation({ summary: 'Complete a lesson' })
  async completeLesson(
    @Param('lessonId') lessonId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{
    userId: string
    lessonId: string
    isCompleted: boolean
    completedAt: Date | null
  }> {
    return this.coursesService.completeLesson(req.user.id, lessonId)
  }

  private async checkOwnership(courseId: string, user: UserPayload): Promise<void> {
    if (user.role === Role.ADMIN) return
    await this.coursesService.checkOwnership(courseId, user.id)
  }
}
