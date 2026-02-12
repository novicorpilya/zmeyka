import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { AIService, AICheckResult } from './ai.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

class ReviewRequestDto {
  code!: string
  taskDescription!: string
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('review')
  async reviewCode(@Body() body: ReviewRequestDto): Promise<AICheckResult> {
    return this.aiService.reviewCodeWithGemini(body.code, body.taskDescription)
  }
}
