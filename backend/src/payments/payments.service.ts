import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import { CoursesService } from '../courses/courses.service'
import { PaymentStatus } from '@prisma/client'

/** Yookassa API response shape */
interface YookassaPaymentResponse {
  id: string
  status: string
  confirmation?: { confirmation_url: string }
}

/** Yookassa webhook body */
export interface YookassaWebhookBody {
  event: string
  object: {
    id: string
    status: string
    metadata?: { userId?: string; courseId?: string }
  }
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)

  constructor(
    private prisma: PrismaService,
    private coursesService: CoursesService,
    private configService: ConfigService,
  ) {}

  async createPayment(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) throw new NotFoundException('Курс не найден')

    // Check if already enrolled
    const isEnrolled = await this.prisma.user.count({
      where: { id: userId, cohorts: { some: { courseId: courseId } } },
    })
    if (isEnrolled > 0) return { status: 'SUCCEEDED', message: 'Вы уже записаны на этот курс' }

    const amount = course.price

    // If course is free, enroll immediately
    if (!amount || amount === 0) {
      await this.coursesService.enroll(courseId, userId)
      return { status: 'SUCCEEDED', message: 'Успешно записаны на бесплатный курс' }
    }

    const shopId = this.configService.get<string>('YOOKASSA_SHOP_ID')
    const secretKey = this.configService.get<string>('YOOKASSA_SECRET_KEY')

    if (!shopId || !secretKey) {
      this.logger.warn('Yookassa keys missing, using MOCK payment mode')
      return this.createMockPayment(userId, courseId, amount)
    }

    return this.createYookassaPayment(userId, courseId, amount, shopId, secretKey)
  }

  private async createMockPayment(userId: string, courseId: string, amount: number) {
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId,
        amount,
        status: PaymentStatus.PENDING,
        provider: 'MOCK',
        providerPaymentId: `mock_${Date.now()}`,
      },
    })
    return {
      paymentId: payment.id,
      status: 'PENDING',
      amount: payment.amount,
      checkoutUrl: `/payments/checkout?id=${payment.id}`,
    }
  }

  private async createYookassaPayment(
    userId: string,
    courseId: string,
    amount: number,
    shopId: string,
    secretKey: string,
  ) {
    const idempotencyKey = `${userId}-${courseId}-${Date.now()}`
    const externalUrl =
      this.configService.get<string>('ALLOWED_ORIGINS')?.split(',')[0] || 'http://localhost:3000'

    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotencyKey,
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount: { value: amount.toFixed(2), currency: 'RUB' },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: `${externalUrl}/courses/${courseId}`,
        },
        description: `Оплата курса по программированию`,
        metadata: { userId, courseId },
      }),
    })

    const data = (await response.json()) as YookassaPaymentResponse

    if (!response.ok) {
      this.logger.error('Yookassa API Error:', JSON.stringify(data))
      throw new Error('Не удалось создать платеж в ЮKassa')
    }

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId,
        amount,
        status: PaymentStatus.PENDING,
        provider: 'YOOKASSA',
        providerPaymentId: data.id,
      },
    })

    if (!data.confirmation?.confirmation_url) {
      this.logger.error('Yookassa response missing confirmation URL')
      throw new Error('Не удалось получить URL оплаты')
    }

    return {
      paymentId: payment.id,
      status: 'PENDING',
      amount: payment.amount,
      checkoutUrl: data.confirmation.confirmation_url,
    }
  }

  async handleWebhook(body: YookassaWebhookBody) {
    this.logger.log(`Received webhook: ${body.event}`)

    if (body.event !== 'payment.succeeded') return { status: 'ignored' }

    const yookassaPayment = body.object
    const providerPaymentId = yookassaPayment.id

    const payment = await this.prisma.payment.findUnique({
      where: { providerPaymentId },
    })

    if (!payment) {
      this.logger.error(`Payment with provider ID ${providerPaymentId} not found`)
      return { status: 'error' }
    }

    if (payment.status === PaymentStatus.SUCCEEDED) return { status: 'already_done' }

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.SUCCEEDED },
      })
      await this.coursesService.enroll(payment.courseId, payment.userId)
    })

    this.logger.log(`Payment succeeded and user enrolled: ${payment.userId} -> ${payment.courseId}`)
    return { status: 'success' }
  }

  async getPayment(id: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { course: true },
    })
    if (!payment) throw new NotFoundException('Платеж не найден')
    if (payment.userId !== userId) throw new ForbiddenException('Нет доступа к этому платежу')
    return payment
  }

  async verifyPayment(paymentId: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) throw new NotFoundException('Платеж не найден')
    if (payment.userId !== userId) throw new ForbiddenException('Нет доступа к этому платежу')

    if (payment.status === PaymentStatus.SUCCEEDED) return payment

    return this.prisma.$transaction(async (tx) => {
      const p = await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.SUCCEEDED },
      })
      await this.coursesService.enroll(p.courseId, p.userId)
      return p
    })
  }
}
