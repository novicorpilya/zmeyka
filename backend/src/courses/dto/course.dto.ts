import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsBoolean } from 'class-validator'

export class CreateCourseDto {
  @ApiProperty({ example: 'Advanced AI with Gemini' })
  @IsString()
  title!: string

  @ApiProperty({ example: 'Learn how to build agents with Gemini API', required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: 'Python', required: false })
  @IsOptional()
  @IsString()
  category?: string

  @ApiProperty({ example: 'Новичок', required: false })
  @IsOptional()
  @IsString()
  level?: string
}

export class UpdateCourseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}
