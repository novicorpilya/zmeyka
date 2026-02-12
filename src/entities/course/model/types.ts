import type { User } from '../../user/model/types'

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
  homeworkSolution?: string
  trinketUrl?: string
  chapters?: string
  order: number
  moduleId: string
  progress?: UserProgress[]
  isLocked?: boolean
  isPreview?: boolean
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
  isEnrolled?: boolean
  level?: string
  category?: string
  price?: number
  mentoringPrice?: number
  studentsCount?: number
  plannedLessonsCount?: number
  introVideoUrl?: string
}
