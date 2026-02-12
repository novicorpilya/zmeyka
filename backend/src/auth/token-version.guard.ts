import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PrismaService } from '../prisma/prisma.service'
import { IS_PUBLIC_KEY } from './public.decorator'

@Injectable()
export class TokenVersionGuard implements CanActivate {
  private readonly logger = new Logger(TokenVersionGuard.name)

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || user.id === undefined || user.tokenVersion === undefined) {
      // Should be caught by JwtGuard, but just in case
      return true
    }

    const cacheKey = `user:${user.id}:v`
    let dbVersion = await this.cacheManager.get<number>(cacheKey)

    if (dbVersion === undefined || dbVersion === null) {
      const dbUser = await this.prisma.user
        .findUnique({
          where: { id: user.id },
          select: { tokenVersion: true },
        })
        .catch((e: unknown) => {
          const message = e instanceof Error ? e.message : String(e)
          this.logger.error(`[TokenVersionGuard] Prisma error: ${message}`)
          return null
        })

      if (!dbUser) {
        // If user doesn't exist anymore, it's a 401
        return false
      }

      dbVersion = dbUser.tokenVersion ?? 0
      // Cache for 10 minutes
      await this.cacheManager.set(cacheKey, dbVersion, 600 * 1000)
    }

    // Use == instead of !== to handle null/undefined if they sneak in,
    // but since we defaulted both to 0, strict !== is fine.
    // We ensure we compare numbers.
    const tokenV = Number(user.tokenVersion) || 0
    const dbV = Number(dbVersion) || 0

    if (dbV !== tokenV) {
      this.logger.warn(
        `[TokenVersionGuard] REJECTED user ${user.id}. Token V: ${tokenV}, DB V: ${dbV}`,
      )
      throw new UnauthorizedException('Token revoked or session expired')
    }

    return true
  }
}
