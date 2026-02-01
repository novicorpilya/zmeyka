import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: dto.role,
        stats: {
          create: {},
        },
      },
    })

    // Log Activity
    await this.prisma.userActivity.create({
      data: {
        userId: user.id,
        type: 'REGISTER',
        points: 10, // Bonus for joining!
      },
    }).catch(err => this.logger.error(`Failed to log registration activity: ${err.message}`))

    const tokens = await this.getTokens(user.id, user.email, user.role)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    const { password, refreshToken: _, ...result } = user
    return {
      user: result,
      ...tokens,
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Log Activity
    await this.prisma.userActivity.create({
      data: {
        userId: user.id,
        type: 'LOGIN',
      },
    }).catch(err => this.logger.error(`Failed to log login activity: ${err.message}`))

    const tokens = await this.getTokens(user.id, user.email, user.role)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    const { password, refreshToken: _, ...result } = user
    return {
      user: result,
      ...tokens,
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })
      .catch(() => {
        throw new ForbiddenException('Invalid Refresh Token')
      })

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied')
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    }

    const tokens = await this.getTokens(user.id, user.email, user.role)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    const { password, refreshToken, ...result } = user
    return result
  }

  async updateProfile(userId: string, data: { name?: string; password?: string; avatar?: string }) {
    const updateData: { name?: string; avatar?: string; password?: string } = {}

    if (data.name) {
      updateData.name = data.name
    }

    if (data.avatar) {
      updateData.avatar = data.avatar
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12)
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    const { password, refreshToken, ...result } = user
    return result
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      this.logger.warn(`Password reset attempted for non-existent email: ${email}`)
      // Return success even if user not found to prevent email enumeration
      return { message: 'Если такой email зарегистрирован, ссылка для сброса пароля отправлена на почту' }
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    })

    this.logger.log(
      `📧 [MAIL MOCK] Reset password link for ${email}: http://localhost:3000/reset-password?token=${resetToken}`,
    )

    return { message: 'Если такой email зарегистрирован, ссылка для сброса пароля отправлена на почту' }
  }

  async resetPassword(token: string, newPassword: string) {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: resetTokenHash,
        resetTokenExpires: { gt: new Date() },
      },
    })

    if (!user) {
      throw new BadRequestException('Неверный или просроченный токен сброса пароля')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    return { message: 'Пароль успешно изменен' }
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12)
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    })
  }

  private async getTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    return { accessToken, refreshToken }
  }
}
