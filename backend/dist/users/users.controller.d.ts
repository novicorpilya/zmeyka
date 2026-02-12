import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { Role, User } from '@prisma/client';
type SafeUser = Omit<User, 'password' | 'refreshToken'>;
interface UserListItem {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    createdAt: Date;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<SafeUser>;
    findAll(): Promise<UserListItem[]>;
    findOne(id: string): Promise<UserListItem | null>;
}
export {};
