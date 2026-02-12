import { Controller, Get, UseGuards, Req, Body, Patch, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { TeacherService, TeacherDashboardSummary } from './teacher.service'
import { RolesGuard } from '../auth/roles.guard'
import { Public } from '../auth/public.decorator'
import { Roles } from '../auth/roles.decorator'
import { Role } from '@prisma/client'
import { UpdateTeacherProfileDto } from './dto/update-profile.dto'

import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('teacher')
@Controller('teacher')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) { }

  @Get('dashboard/summary')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get teacher dashboard summary' })
  async getSummary(@Req() req: AuthenticatedRequest): Promise<TeacherDashboardSummary> {
    return this.teacherService.getDashboardSummary(req.user.id)
  }

  @Get('profile')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get teacher profile' })
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.teacherService.getProfile(req.user.id)
  }

  @Patch('profile')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update teacher profile' })
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() data: UpdateTeacherProfileDto) {
    return this.teacherService.updateProfile(req.user.id, data)
  }

  @Get('public-profile/:userId')
  @Public()
  @ApiOperation({ summary: 'Get public teacher profile' })
  async getPublicProfile(@Param('userId') userId: string) {
    return this.teacherService.getPublicProfile(userId)
  }
}
