import { Controller, Post, Get, Body, Param, UseGuards, Req, Patch, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { HomeworksService } from './homeworks.service'
import { SubmitHomeworkDto, UpdateHomeworkStatusDto } from './dto/homework.dto'
import { CreateCommentDto } from './dto/comment.dto'
import { Roles } from '../auth/roles.decorator'
import { Role } from '@prisma/client'
import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('homeworks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) { }

  @Post('submit')
  @ApiOperation({ summary: 'Submit homework for a lesson' })
  submit(@Req() req: AuthenticatedRequest, @Body() dto: SubmitHomeworkDto) {
    return this.homeworksService.submitHomework(req.user.id, dto)
  }

  @Get('status/:lessonId')
  @ApiOperation({ summary: 'Get homework status and comments for a lesson (current user)' })
  getStatus(@Req() req: AuthenticatedRequest, @Param('lessonId') lessonId: string) {
    return this.homeworksService.getHomeworkStatus(req.user.id, lessonId)
  }

  @Get('detail/:homeworkId')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Get full homework details by ID (for teacher review)' })
  async getById(@Req() req: AuthenticatedRequest, @Param('homeworkId') homeworkId: string) {
    return this.homeworksService.getHomeworkById(homeworkId, req.user.id)
  }

  @Patch(':id/status')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Update homework status (Teacher only)' })
  updateStatus(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() dto: UpdateHomeworkStatusDto) {
    return this.homeworksService.updateStatus(id, req.user.id, dto)
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to homework' })
  addComment(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() dto: CreateCommentDto) {
    return this.homeworksService.addComment(id, req.user.id, dto)
  }
}
