import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiProperty({ example: 'Ivan Ivanov' })
  @IsString()
  name!: string

  @ApiProperty({ example: 'STUDENT', enum: Role })
  @IsEnum(Role)
  role!: Role
}
