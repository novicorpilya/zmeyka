export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface RefreshResponse {
  accessToken: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface UserStats {
  xp: number
  level: number
  streak: number
  completedCourses: number
  completedLessons: number
}

export interface UserProgress {
  isCompleted: boolean
  completedAt?: string
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctOption: number
}

export interface Quiz {
  id: string
  lessonId: string
  questions: Question[]
}

export interface Lesson {
  id: string
  title: string
  content?: string
  contentRich?: string
  videoUrl?: string
  homeworkTitle?: string
  homeworkTask?: string
  conspectusFile?: string
  homeworkFile?: string
  order: number
  moduleId: string
  progress?: UserProgress[]
}

export interface Module {
  id: string
  title: string
  order: number
  courseId: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description?: string
  thumbnail?: string
  teacherId: string
  teacher?: User
  modules?: Module[]
  calculatedProgress?: number
  calculatedXp?: number
  isPublished?: boolean
  level?: string
  category?: string
  studentsCount?: number
}

export interface DashboardSummary {
  stats: UserStats
  activeCourses: Array<
    Course & {
      teacherName: string
      progress: number
      totalLessons: number
      completedLessons: number
    }
  >
  recentActivity: Array<{
    id: string
    date: string
    points: number
    type: string
  }>
}

export interface TeacherDashboardSummary {
  stats: {
    totalCourses: number
    totalStudents: number
    pendingHomeworks: number
    activeToday: number
  }
  recentHomeworks: Array<{
    id: string
    studentName: string
    courseTitle: string
    submittedAt: string
  }>
  coursesPerformance: Array<{
    id: string
    title: string
    studentsCount: number
    completionRate: number
  }>
  students: Array<{
    id: string
    name: string
    avatar: string | null
    email: string
    homeworksCount: number
  }>
}

export interface HomeworkComment {
  id: string
  homeworkId: string
  authorId: string
  text: string
  createdAt: string
  author: User
}

export interface Homework {
  id: string
  lessonId: string
  studentId: string
  solutionText?: string
  solutionFile?: string
  status: 'PENDING' | 'CHECKING' | 'COMPLETED' | 'REJECTED'
  score?: number
  feedback?: string
  submittedAt: string
  lesson: Lesson
  student: User
  comments?: HomeworkComment[]
}
