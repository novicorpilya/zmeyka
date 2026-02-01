import { Controller, Get, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'

import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get aggregated dashboard data for the current student' })
  async getSummary(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getSummary(req.user.id)
  }
}
