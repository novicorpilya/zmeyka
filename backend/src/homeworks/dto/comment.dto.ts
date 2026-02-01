import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
  @ApiProperty({ example: 'Отличная работа, но поправь форматирование в 3 строке' })
  @IsString()
  @MinLength(1)
  text!: string
}
