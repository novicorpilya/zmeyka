export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface Course {
    id: string;
    title: string;
    description?: string;
    videoUrls: string; // JSON string
    quizzes: string;   // JSON string
    teacherId: string;
    teacher?: User;
}

export interface Homework {
    id: string;
    status: 'PENDING' | 'CHECKING' | 'COMPLETED' | 'REJECTED';
    score?: number;
    feedback?: string;
    courseId: string;
    studentId: string;
}
