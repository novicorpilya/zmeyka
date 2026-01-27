import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
    @ApiProperty({ example: 'Advanced AI with Gemini' })
    title: string;

    @ApiProperty({ example: 'Learn how to build agents with Gemini API', required: false })
    description?: string;

    @ApiProperty({ example: '["https://video.url/1"]' })
    videoUrls: string;

    @ApiProperty({ example: '[]' })
    quizzes: string;

    @ApiProperty({ example: 'user-uuid-here' })
    teacherId: string;
}

export class UpdateCourseDto {
    @ApiProperty({ required: false })
    title?: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty({ required: false })
    videoUrls?: string;

    @ApiProperty({ required: false })
    quizzes?: string;
}
