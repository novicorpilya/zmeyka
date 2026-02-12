import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { ExecutionService, ExecutionResult } from './execution.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('execution')
@Controller('execution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('run')
  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Run Python code safely' })
  async runCode(
    @Body('code') code: string,
    @Body('lessonId') lessonId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ExecutionResult> {
    return this.executionService.runPython(code, req.user.id, lessonId)
  }
}
