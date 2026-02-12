import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import * as Sentry from '@sentry/nestjs'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter')

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal Server Error' }

    const logMessage = `${request.method} ${request.url} - Status: ${status}`

    // Log the full error for debugging
    this.logger.error(logMessage)
    if (exception instanceof Error) {
      this.logger.error(exception.stack)
    }

    // In Production/Stage, capture 500 errors in Sentry
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Sentry.captureException(exception)
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof message === 'object' ? message : { message }),
    })
  }
}
