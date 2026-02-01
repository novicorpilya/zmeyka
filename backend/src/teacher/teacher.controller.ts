import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { TeacherService } from './teacher.service'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role } from '@prisma/client'

import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('teacher')
@Controller('teacher')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard/summary')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get teacher dashboard summary' })
  async getSummary(@Req() req: AuthenticatedRequest) {
    return this.teacherService.getDashboardSummary(req.user.id)
  }
}
