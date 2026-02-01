import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { IsEmail, IsString, IsEnum, MinLength, IsOptional } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'teacher@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ enum: Role, default: Role.STUDENT })
  @IsEnum(Role)
  role!: Role
}
