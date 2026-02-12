import type { Lesson } from '../../course/model/types'
import type { User } from '../../user/model/types'

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
  status: 'PENDING' | 'CHECKING' | 'COMPLETED' | 'REJECTED' | 'NEEDS_REVIEW' | 'NOT_STARTED'
  score?: number
  feedback?: string
  submittedAt: string
  createdAt: string
  updatedAt: string
  lesson: Lesson
  student: User
  course?: { title: string }
  courseTitle?: string
  courseId?: string
  comments?: HomeworkComment[]
  socraticHints?: string
  aiReasoning?: string
  aiScoreDraft?: number
  aiFeedbackDraft?: string
  confidenceScore?: number
  integrityScore?: number
  integrityReasoning?: string
}
