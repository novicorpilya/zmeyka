import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreatePaymentDto {
  @ApiProperty({ example: 'course-uuid-here' })
  @IsString()
  @IsNotEmpty()
  courseId!: string
}
