import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { BuilderService } from './builder.service'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { Role } from '@prisma/client'
import {
  CreateModuleDto,
  UpdateModuleDto,
  CreateLessonDto,
  UpdateLessonDto,
  ReorderItemDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from './dto/builder.dto'
import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('builder')
@Controller('builder')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.TEACHER, Role.ADMIN)
export class BuilderController {
  constructor(private readonly builderService: BuilderService) {}

  @Get('course/:id')
  @ApiOperation({ summary: 'Get full course structure for builder' })
  async getStructure(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.builderService.validateOwnership(req.user.id, { courseId: id })
    return this.builderService.getFullStructure(id)
  }

  // --- MODULES ---
  @Post('modules')
  @ApiOperation({ summary: 'Create a new module' })
  async createModule(@Body() data: CreateModuleDto, @Req() req: AuthenticatedRequest) {
    await this.builderService.validateOwnership(req.user.id, { courseId: data.courseId })
    return this.builderService.createModule(data)
  }

  @Patch('modules/:id')
  @ApiOperation({ summary: 'Update module' })
  async updateModule(
    @Param('id') id: string,
    @Body() data: UpdateModuleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.builderService.validateOwnership(req.user.id, { moduleId: id })
    return this.builderService.updateModule(id, data)
  }

  @Delete('modules/:id')
  @ApiOperation({ summary: 'Remove module' })
  async deleteModule(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.builderService.validateOwnership(req.user.id, { moduleId: id })
    return this.builderService.deleteModule(id)
  }

  // --- LESSONS ---
  @Post('lessons')
  @ApiOperation({ summary: 'Create a new lesson' })
  async createLesson(@Body() data: CreateLessonDto, @Req() req: AuthenticatedRequest) {
    await this.builderService.validateOwnership(req.user.id, { moduleId: data.moduleId })
    return this.builderService.createLesson(data)
  }

  @Patch('lessons/:id')
  @ApiOperation({ summary: 'Update lesson' })
  async updateLesson(
    @Param('id') id: string,
    @Body() data: UpdateLessonDto,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.builderService.validateOwnership(req.user.id, { lessonId: id })
    return this.builderService.updateLesson(id, data)
  }

  @Delete('lessons/:id')
  @ApiOperation({ summary: 'Remove lesson' })
  async deleteLesson(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.builderService.validateOwnership(req.user.id, { lessonId: id })
    return this.builderService.deleteLesson(id)
  }

  @Patch('reorder/:type')
  @ApiOperation({ summary: 'Bulk update orders' })
  async reorder(
    @Param('type') type: 'module' | 'lesson',
    @Body() orders: ReorderItemDto[],
    @Req() req: AuthenticatedRequest,
  ) {
    if (orders.length > 0) {
      const firstId = orders[0].id
      await this.builderService.validateOwnership(
        req.user.id,
        type === 'module' ? { moduleId: firstId } : { lessonId: firstId },
      )
    }
    return this.builderService.updateOrders(type, orders)
  }

  // --- QUIZ ---
  @Get('quiz/:lessonId')
  @ApiOperation({ summary: 'Get quiz and questions' })
  async getQuiz(@Param('lessonId') lessonId: string, @Req() req: AuthenticatedRequest) {
    await this.builderService.validateOwnership(req.user.id, { lessonId })
    return this.builderService.getQuiz(lessonId)
  }

  @Post('quiz/:lessonId/ensure')
  @ApiOperation({ summary: 'Ensure quiz exists' })
  async ensureQuiz(@Param('lessonId') lessonId: string, @Req() req: AuthenticatedRequest) {
    await this.builderService.validateOwnership(req.user.id, { lessonId })
    return this.builderService.ensureQuiz(lessonId)
  }

  @Post('quiz/:quizId/questions')
  @ApiOperation({ summary: 'Add question to quiz' })
  async addQuestion(
    @Param('quizId') quizId: string,
    @Body() data: CreateQuestionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.builderService.validateOwnership(req.user.id, { quizId })
    return this.builderService.addQuestion(quizId, data)
  }

  @Patch('questions/:id')
  @ApiOperation({ summary: 'Update question' })
  async updateQuestion(
    @Param('id') id: string,
    @Body() data: UpdateQuestionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.builderService.validateOwnership(req.user.id, { questionId: id })
    return this.builderService.updateQuestion(id, data)
  }

  @Delete('questions/:id')
  @ApiOperation({ summary: 'Remove question' })
  async deleteQuestion(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.builderService.validateOwnership(req.user.id, { questionId: id })
    return this.builderService.deleteQuestion(id)
  }
}
