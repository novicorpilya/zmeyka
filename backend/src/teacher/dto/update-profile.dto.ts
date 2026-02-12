import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsInt, IsUrl, IsObject } from 'class-validator'

export class UpdateTeacherProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  videoUrl?: string

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[]

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  institution?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  workplace?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  education?: string

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  experience?: number

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  certificates?: any

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievements?: string[]

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  socialLinks?: any
}
