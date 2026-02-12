import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CohortsService, CreateCohortDto } from './cohorts.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role, Cohort } from '@prisma/client'
import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('cohorts')
@Controller('cohorts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new cohort' })
  async create(@Body() dto: CreateCohortDto): Promise<Cohort> {
    return this.cohortsService.create(dto)
  }

  @Get()
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get all cohorts for teacher' })
  async findAll(@Req() req: AuthenticatedRequest): Promise<Cohort[]> {
    return this.cohortsService.findAllByTeacher(req.user.id)
  }

  @Get(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get cohort by id' })
  async findOne(@Param('id') id: string): Promise<Cohort | null> {
    return this.cohortsService.findOne(id)
  }

  @Post(':id/students')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Add student to cohort' })
  async addStudent(@Param('id') id: string, @Body('studentId') studentId: string): Promise<Cohort> {
    return this.cohortsService.addStudent(id, studentId)
  }

  @Get(':id/analytics')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get drop-off analytics for cohort' })
  async getAnalytics(@Param('id') id: string): Promise<
    Array<{
      lessonId: string
      lessonTitle: string
      completedCount: number
      totalStudents: number
      completionRate: number
    }>
  > {
    return this.cohortsService.getDropOffAnalytics(id)
  }
}
