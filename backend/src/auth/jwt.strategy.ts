import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Role } from '@prisma/client'

interface JwtPayload {
  sub: string
  email: string
  role: Role
  v: number
}

interface ValidatedUserPayload {
  id: string
  email: string
  role: Role
  tokenVersion: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET')
    if (!secret) {
      throw new Error('CRITICAL: JWT_SECRET is not defined in environment variables.')
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromUrlQueryParameter('accessToken'),
        ExtractJwt.fromUrlQueryParameter('access_token'),
        (req: Request): string | null => {
          if (req && req.cookies) {
            return req.cookies['access_token'] || req.cookies['accessToken'] || null
          }
          return null
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  async validate(payload: JwtPayload): Promise<ValidatedUserPayload> {
    // PERFORMANCE OP: We trust the token signature (verified by Passport).
    // avoiding a DB call on every single request.
    // If you need to revoke tokens, implement a Redis blacklist or use short-lived access tokens.
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tokenVersion: payload.v,
    }
  }
}
