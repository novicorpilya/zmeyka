import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty({ example: 'teacher@example.com' })
    email: string;

    @ApiProperty({ example: 'John Doe', required: false })
    name?: string;

    @ApiProperty({ enum: Role, default: Role.STUDENT })
    role: Role;
}
