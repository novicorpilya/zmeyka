export interface Cohort {
  id: string
  name: string
  course: { title: string }
}

export interface AnalyticsItem {
  lessonId: string
  lessonTitle: string
  completionRate: number
  completedCount: number
  totalStudents: number
}

export interface TeacherDashboardSummary {
  stats: {
    totalCourses: number
    totalStudents: number
    pendingHomeworks: number
    activeToday: number
    homeworksThisWeek: number
    averageScore: number
    globalCompletionRate: number
  }
  recentHomeworks: Array<{
    id: string
    studentName: string
    courseTitle: string
    submittedAt: string
    commentsCount: number
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
    lastHomeworkId: string | null
  }>
}

export interface TeacherProfile {
  id: string
  userId: string
  bio: string | null
  videoUrl: string | null
  subjects: string[]
  institution: string | null
  workplace: string | null
  education: string | null
  experience: number | null
  certificates: Array<{
    title: string
    issuer: string
    year: string
    url?: string
  }> | null
  achievements: string[]
  socialLinks: {
    linkedin?: string
    github?: string
    telegram?: string
    website?: string
    [key: string]: string | undefined
  } | null
  name?: string
  avatar?: string | null
}
