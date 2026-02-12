import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { User, Role, Prisma } from '@prisma/client';
type SafeUser = Omit<User, 'password' | 'refreshToken'>;
interface UserListItem {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    createdAt: Date;
}
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<SafeUser>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    findByResetToken(tokenHash: string): Promise<User | null>;
    findAll(): Promise<UserListItem[]>;
    findOne(id: string): Promise<UserListItem | null>;
}
export {};
