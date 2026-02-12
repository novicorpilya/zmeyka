export declare class CreateCourseDto {
    title: string;
    description?: string;
    category?: string;
    level?: string;
    plannedLessonsCount?: number;
    price?: number;
    mentoringPrice?: number;
    introVideoUrl?: string;
}
export declare class UpdateCourseDto {
    title?: string;
    description?: string;
    category?: string;
    level?: string;
    isPublished?: boolean;
    plannedLessonsCount?: number;
    price?: number;
    mentoringPrice?: number;
    introVideoUrl?: string;
}
