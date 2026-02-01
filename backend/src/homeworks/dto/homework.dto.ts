import { IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum HomeworkStatus {
  PENDING = 'PENDING',
  CHECKING = 'CHECKING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export class SubmitHomeworkDto {
  @ApiProperty({ example: 'd992ce43-...' })
  @IsString()
  lessonId!: string

  @ApiProperty({ example: 'e723a156-...' })
  @IsString()
  courseId!: string

  @ApiProperty({ example: 'print("hello")' })
  @IsString()
  @IsOptional()
  solutionText?: string
}

export class UpdateHomeworkStatusDto {
  @ApiProperty({ enum: HomeworkStatus })
  @IsEnum(HomeworkStatus)
  status!: HomeworkStatus

  @ApiProperty({ example: 'print("updated solution")', required: false })
  @IsString()
  @IsOptional()
  solutionText?: string

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number

  @ApiProperty({ example: 'Молодец!', required: false })
  @IsOptional()
  @IsString()
  feedback?: string
}
