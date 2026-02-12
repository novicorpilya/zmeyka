import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../shared/interfaces/request.interface';
import { User } from '@prisma/client';
type SafeUser = Omit<User, 'password' | 'refreshToken'>;
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<Response>;
    login(dto: LoginDto, res: Response): Promise<Response>;
    logout(req: AuthenticatedRequest, res: Response): Promise<Response>;
    refresh(req: Request, res: Response): Promise<Response>;
    getMe(req: AuthenticatedRequest): Promise<SafeUser>;
    updateProfile(req: AuthenticatedRequest, dto: UpdateProfileDto): Promise<SafeUser>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private setCookies;
}
export {};
