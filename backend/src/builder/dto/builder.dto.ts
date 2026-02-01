import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateModuleDto {
  @ApiProperty({ example: 'Introduction to Python' })
  @IsString()
  title!: string

  @ApiProperty()
  @IsString()
  courseId!: string

  @ApiProperty()
  @IsNumber()
  order!: number
}

export class UpdateModuleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number
}

export class CreateLessonDto {
  @ApiProperty({ example: 'Variables and Types' })
  @IsString()
  title!: string

  @ApiProperty()
  @IsString()
  moduleId!: string

  @ApiProperty()
  @IsNumber()
  order!: number
}

export class UpdateLessonDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contentRich?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  homeworkTitle?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  homeworkTask?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  conspectusFile?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  homeworkFile?: string
}

export class ReorderItemDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsNumber()
  order!: number
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  text!: string

  @ApiProperty()
  @IsString()
  options!: string

  @ApiProperty()
  @IsNumber()
  correctOption!: number
}

export class UpdateQuestionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  options?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  correctOption?: number
}
