import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            resetToken: string | null;
            resetTokenExpires: Date | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            resetToken: string | null;
            resetTokenExpires: Date | null;
        };
    }>;
    logout(userId: string): Promise<void>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(userId: string): Promise<{
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
    updateProfile(userId: string, data: {
        name?: string;
        password?: string;
        avatar?: string;
    }): Promise<{
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
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    private updateRefreshToken;
    private getTokens;
}
