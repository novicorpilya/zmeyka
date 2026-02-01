import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../shared/interfaces/request.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(dto: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getMe(req: AuthenticatedRequest): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        resetToken: string | null;
        resetTokenExpires: Date | null;
    }>;
    updateProfile(req: AuthenticatedRequest, dto: UpdateProfileDto): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        resetToken: string | null;
        resetTokenExpires: Date | null;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private setCookies;
}
