import { Controller, Get, Sse, Req, Query, Post, Param, Body, UseGuards } from '@nestjs/common'
import { NotificationsService, NotificationPayload } from './notifications.service'
import { map, Observable } from 'rxjs'
import { AuthenticatedRequest } from '../shared/interfaces/request.interface'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse('sse')
  sse(@Req() req: AuthenticatedRequest): Observable<{ data: NotificationPayload }> {
    return this.notificationsService
      .subscribe(req.user.id)
      .pipe(map((notification) => ({ data: notification })))
  }

  @Get('recent')
  async getRecent(@Req() req: AuthenticatedRequest, @Query('limit') limit?: number) {
    return this.notificationsService.getRecent(req.user.id, limit)
  }

  @Post('mark-read/:id')
  async markRead(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.id)
  }

  @Post('mark-all-read')
  async markAllRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req.user.id)
  }
}
