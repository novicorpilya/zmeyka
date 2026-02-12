import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { UsersService } from '../users/users.service'

type SafeUser = Omit<User, 'password' | 'refreshToken'>

interface AuthResponse {
  user: SafeUser
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.userService.findByEmail(dto.email)

    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12)

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          role: dto.role,
          stats: { create: {} },
        },
      })

      // Log Welcome Activity within the same transaction
      await tx.userActivity.create({
        data: {
          userId: user.id,
          type: 'REGISTER',
          points: 10,
        },
      })

      const tokens = await this.getTokens(user.id, user.email, user.role, user.tokenVersion || 0)

      // Update Refresh Token (Hashed)
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 12)
      await tx.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, refreshToken: _refreshToken, ...result } = user
      return {
        user: result,
        ...tokens,
      }
    })
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(dto.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Log Activity
    await this.prisma.userActivity
      .create({
        data: {
          userId: user.id,
          type: 'LOGIN',
        },
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err)
        this.logger.error(`Failed to log login activity: ${message}`)
      })

    const tokens = await this.getTokens(user.id, user.email, user.role, user.tokenVersion || 0)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, refreshToken: _refreshToken, ...result } = user
    return {
      user: result,
      ...tokens,
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userService.update(userId, { refreshToken: null })
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })
      .catch(() => {
        throw new ForbiddenException('Invalid Refresh Token')
      })

    const user = await this.userService.findById(payload.sub)

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied')
    }

    // Senior Security: Check if token version matches database version
    // If user changed password, tokenVersion increments and all old refresh tokens become invalid
    if (payload.v !== user.tokenVersion) {
      this.logger.warn(
        `Security alert: Token version mismatch for user ${user.id}. Possible session hijacking or old session reuse.`,
      )
      throw new ForbiddenException('Session expired')
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    }

    const tokens = await this.getTokens(user.id, user.email, user.role, user.tokenVersion || 0)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await this.userService.findById(userId)

    if (!user) {
      throw new UnauthorizedException()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, refreshToken: _refreshToken, ...result } = user
    return result
  }

  async updateProfile(
    userId: string,
    data: { name?: string; password?: string; avatar?: string },
  ): Promise<SafeUser> {
    const user = await this.userService.update(userId, data)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, refreshToken: _refreshToken, ...result } = user
    return result
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      this.logger.warn(`Password reset attempted for non-existent email: ${email}`)
      // Return success even if user not found to prevent email enumeration
      return {
        message: 'Если такой email зарегистрирован, ссылка для сброса пароля отправлена на почту',
      }
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    await this.userService.update(user.id, {
      resetToken: resetTokenHash,
      resetTokenExpires: new Date(Date.now() + 3600000), // 1 hour
    })

    this.logger.log(
      `📧 [MAIL MOCK] Reset password link for ${email}: http://localhost:3000/reset-password?token=${resetToken}`,
    )

    return {
      message: 'Если такой email зарегистрирован, ссылка для сброса пароля отправлена на почту',
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const user = await this.userService.findByResetToken(resetTokenHash)

    if (!user) {
      throw new BadRequestException('Неверный или просроченный токен сброса пароля')
    }

    await this.userService.update(user.id, {
      password: newPassword,
      resetToken: null,
      resetTokenExpires: null,
    })

    return { message: 'Пароль успешно изменен' }
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12)
    await this.userService.update(userId, { refreshToken: hashedRefreshToken })
  }

  private async getTokens(
    userId: string,
    email: string,
    role: string,
    tokenVersion: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role, v: tokenVersion },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '8h',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role, v: tokenVersion },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    return { accessToken, refreshToken }
  }
}
