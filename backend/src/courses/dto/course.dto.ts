import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator'

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

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  plannedLessonsCount?: number

  @ApiProperty({ example: 5000, required: false })
  @IsOptional()
  @IsInt()
  price?: number

  @ApiProperty({ example: 1500, required: false })
  @IsOptional()
  @IsInt()
  mentoringPrice?: number

  @ApiProperty({ example: 'https://youtube.com/watch?v=...', required: false })
  @IsOptional()
  @IsString()
  introVideoUrl?: string
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  plannedLessonsCount?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  price?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  mentoringPrice?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  introVideoUrl?: string
}
