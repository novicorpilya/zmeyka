import { Controller, Post, Get, Body, Param, UseGuards, Req, Patch } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { HomeworksService } from './homeworks.service'
import { SubmitHomeworkDto, UpdateHomeworkStatusDto } from './dto/homework.dto'
import { CreateCommentDto } from './dto/comment.dto'
import { Roles } from '../auth/roles.decorator'
import { Role, Homework, Comment as PrismaComment } from '@prisma/client'
import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('homeworks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Get('student')
  @ApiOperation({ summary: 'Get all homeworks for the current student' })
  getStudentHomeworks(@Req() req: AuthenticatedRequest): Promise<any[]> {
    return this.homeworksService.getStudentHomeworks(req.user.id)
  }

  @Post('submit')
  @Throttle({ long: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit homework for a lesson' })
  submit(@Req() req: AuthenticatedRequest, @Body() dto: SubmitHomeworkDto): Promise<Homework> {
    return this.homeworksService.submitHomework(req.user.id, dto)
  }

  @Get('status/:lessonId')
  @ApiOperation({ summary: 'Get homework status and comments for a lesson (current user)' })
  getStatus(
    @Req() req: AuthenticatedRequest,
    @Param('lessonId') lessonId: string,
  ): Promise<Homework | null> {
    return this.homeworksService.getHomeworkStatus(req.user.id, lessonId)
  }

  @Get('detail/:homeworkId')
  @ApiOperation({ summary: 'Get full homework details by ID' })
  async getById(
    @Req() req: AuthenticatedRequest,
    @Param('homeworkId') homeworkId: string,
  ): Promise<Homework | null> {
    return this.homeworksService.getHomeworkById(homeworkId, req.user.id)
  }

  @Get('review/pending')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get homeworks requiring manual review' })
  getPendingReviews(@Req() req: AuthenticatedRequest): Promise<Homework[]> {
    return this.homeworksService.getPendingReviews(req.user.id)
  }

  @Patch(':id/status')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update homework status (Teacher only)' })
  updateStatus(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateHomeworkStatusDto,
  ): Promise<Homework> {
    return this.homeworksService.updateStatus(id, req.user.id, dto)
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to homework' })
  addComment(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCommentDto,
  ): Promise<PrismaComment> {
    return this.homeworksService.addComment(id, req.user.id, dto)
  }

  @Post('ensure-chat/:studentId')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Ensure a chat thread exists for a student and teacher' })
  ensureChat(
    @Req() req: AuthenticatedRequest,
    @Param('studentId') studentId: string,
  ): Promise<{ homeworkId: string }> {
    return this.homeworksService.ensureChat(req.user.id, studentId)
  }
}
