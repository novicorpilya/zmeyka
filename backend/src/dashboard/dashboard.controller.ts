import { Controller, Get, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DashboardService, DashboardSummary } from './dashboard.service'

import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get aggregated dashboard data for the current student' })
  async getSummary(@Req() req: AuthenticatedRequest): Promise<DashboardSummary> {
    return this.dashboardService.getSummary(req.user.id)
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get activity heat map data' })
  async getActivity(
    @Req() req: AuthenticatedRequest,
  ): Promise<Array<{ date: string; points: number }>> {
    return this.dashboardService.getActivity(req.user.id)
  }
}
