"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService, userService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existingUser = await this.userService.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    name: dto.name,
                    role: dto.role,
                    stats: { create: {} },
                },
            });
            await tx.userActivity.create({
                data: {
                    userId: user.id,
                    type: 'REGISTER',
                    points: 10,
                },
            });
            const tokens = await this.getTokens(user.id, user.email, user.role, user.tokenVersion || 0);
            const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 12);
            await tx.user.update({
                where: { id: user.id },
                data: { refreshToken: hashedRefreshToken },
            });
            const { password: _password, refreshToken: _refreshToken, ...result } = user;
            return {
                user: result,
                ...tokens,
            };
        });
    }
    async login(dto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.userActivity
            .create({
            data: {
                userId: user.id,
                type: 'LOGIN',
            },
        })
            .catch((err) => {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.error(`Failed to log login activity: ${message}`);
        });
        const tokens = await this.getTokens(user.id, user.email, user.role, user.tokenVersion || 0);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const { password: _password, refreshToken: _refreshToken, ...result } = user;
        return {
            user: result,
            ...tokens,
        };
    }
    async logout(userId) {
        await this.userService.update(userId, { refreshToken: null });
    }
    async refreshTokens(refreshToken) {
        const payload = await this.jwtService
            .verifyAsync(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        })
            .catch(() => {
            throw new common_1.ForbiddenException('Invalid Refresh Token');
        });
        const user = await this.userService.findById(payload.sub);
        if (!user || !user.refreshToken) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        if (payload.v !== user.tokenVersion) {
            this.logger.warn(`Security alert: Token version mismatch for user ${user.id}. Possible session hijacking or old session reuse.`);
            throw new common_1.ForbiddenException('Session expired');
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const tokens = await this.getTokens(user.id, user.email, user.role, user.tokenVersion || 0);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async getMe(userId) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const { password: _password, refreshToken: _refreshToken, ...result } = user;
        return result;
    }
    async updateProfile(userId, data) {
        const user = await this.userService.update(userId, data);
        const { password: _password, refreshToken: _refreshToken, ...result } = user;
        return result;
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.logger.warn(`Password reset attempted for non-existent email: ${email}`);
            return {
                message: 'Если такой email зарегистрирован, ссылка для сброса пароля отправлена на почту',
            };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        await this.userService.update(user.id, {
            resetToken: resetTokenHash,
            resetTokenExpires: new Date(Date.now() + 3600000),
        });
        this.logger.log(`📧 [MAIL MOCK] Reset password link for ${email}: http://localhost:3000/reset-password?token=${resetToken}`);
        return {
            message: 'Если такой email зарегистрирован, ссылка для сброса пароля отправлена на почту',
        };
    }
    async resetPassword(token, newPassword) {
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await this.userService.findByResetToken(resetTokenHash);
        if (!user) {
            throw new common_1.BadRequestException('Неверный или просроченный токен сброса пароля');
        }
        await this.userService.update(user.id, {
            password: newPassword,
            resetToken: null,
            resetTokenExpires: null,
        });
        return { message: 'Пароль успешно изменен' };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
        await this.userService.update(userId, { refreshToken: hashedRefreshToken });
    }
    async getTokens(userId, email, role, tokenVersion) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, role, v: tokenVersion }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '8h',
            }),
            this.jwtService.signAsync({ sub: userId, email, role, v: tokenVersion }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map