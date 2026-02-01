import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        refreshToken: string | null;
        resetToken: string | null;
        resetTokenExpires: Date | null;
    }>;
    findAll(): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    findOne(id: string): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    } | null>;
}
