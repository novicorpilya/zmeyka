import { Injectable, ExecutionContext, Logger } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  private readonly logger = new Logger(JwtAuthGuard.name)

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const url = request.url
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    try {
      const res = await super.canActivate(context)
      return res as boolean
    } catch (e) {
      if (isPublic) {
        return true
      }

      const hasTokenParam = !!request.query?.token
      const authHeader = request.headers?.authorization

      this.logger.warn(`[JwtAuthGuard] Rejecting request to ${url}. Public: ${isPublic}. Has token param: ${hasTokenParam}. Has auth header: ${!!authHeader}`)

      throw e
    }
  }
}
