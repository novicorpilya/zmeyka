import { Controller, Post, Body, Req, UseGuards, Get, Param, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PaymentsService } from './payments.service'
import type { YookassaWebhookBody } from './payments.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { RolesGuard } from '../auth/roles.guard'
import { AuthenticatedRequest } from '../shared/interfaces/request.interface'
import { Public } from '../auth/public.decorator'

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new payment/checkout session' })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentsService.createPayment(req.user.id, createPaymentDto.courseId)
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get payment details' })
  async getPayment(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.paymentsService.getPayment(id, req.user.id)
  }

  @Post(':id/verify')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Verify and finalize a payment (Manual/Mock)' })
  async verifyPayment(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.paymentsService.verifyPayment(id, req.user.id)
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Yookassa Webhook' })
  async webhook(@Body() body: YookassaWebhookBody) {
    return this.paymentsService.handleWebhook(body)
  }
}
