import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, ValidateIf, Allow, IsBoolean } from 'class-validator'

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  trinketUrl?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean
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
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  videoUrl?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  content?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  contentRich?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  homeworkTitle?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  homeworkTask?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  conspectusFile?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  homeworkFile?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  homeworkSolution?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  trinketUrl?: string | null

  @ApiProperty({ required: false })
  @Allow()
  @ValidateIf((o: unknown, v: unknown) => v !== null)
  @IsOptional()
  @IsString()
  chapters?: string | null

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean
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
