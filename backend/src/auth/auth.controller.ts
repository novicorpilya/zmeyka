import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
  Patch,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { Response, Request } from 'express'
import { Public } from './public.decorator'

import { AuthenticatedRequest } from '../shared/interfaces/request.interface'
import { CookieOptions } from 'express'
import { User } from '@prisma/client'

type SafeUser = Omit<User, 'password' | 'refreshToken'>

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() dto: RegisterDto, @Res() res: Response): Promise<Response> {
    const result = await this.authService.register(dto)
    this.setCookies(res, result.accessToken, result.refreshToken)
    return res.status(HttpStatus.CREATED).json(result)
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Res() res: Response): Promise<Response> {
    const result = await this.authService.login(dto)
    this.setCookies(res, result.accessToken, result.refreshToken, dto.rememberMe)
    return res.status(HttpStatus.OK).json(result)
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<Response> {
    await this.authService.logout(req.user.id)
    res.clearCookie('refresh_token')
    res.clearCookie('access_token')
    return res.status(HttpStatus.OK).json({ message: 'Logged out' })
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const refreshToken = req.cookies['refresh_token']
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found')
    }

    const tokens = await this.authService.refreshTokens(refreshToken)
    this.setCookies(res, tokens.accessToken, tokens.refreshToken)
    return res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken })
  }

  @Post('me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Req() req: AuthenticatedRequest): Promise<SafeUser> {
    return this.authService.getMe(req.user.id)
  }

  @Patch('profile')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<SafeUser> {
    return this.authService.updateProfile(req.user.id, dto)
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(dto.email)
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    return this.authService.resetPassword(dto.token, dto.newPassword)
  }

  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    remember: boolean = true,
  ): void {
    const commonOptions: CookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    }

    if (remember) {
      commonOptions.maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
    }

    // Refresh token: MUST be httpOnly for security
    res.cookie('refresh_token', refreshToken, {
      ...commonOptions,
      httpOnly: true,
    })

    // Access token: httpOnly: false allows frontend API client to read it and put into Authorization header
    // This prevents unnecessary 401 errors during token rotation
    res.cookie('access_token', accessToken, {
      ...commonOptions,
      httpOnly: false,
    })
  }
}
