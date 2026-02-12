import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
type SafeUser = Omit<User, 'password' | 'refreshToken'>;
interface AuthResponse {
    user: SafeUser;
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private userService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, userService: UsersService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    logout(userId: string): Promise<void>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(userId: string): Promise<SafeUser>;
    updateProfile(userId: string, data: {
        name?: string;
        password?: string;
        avatar?: string;
    }): Promise<SafeUser>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    private updateRefreshToken;
    private getTokens;
}
export {};
