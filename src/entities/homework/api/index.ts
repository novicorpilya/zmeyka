import { useApi } from '@shared/api'
import type { Homework } from '@shared/types'

export interface HomeworkComment {
  id: string
  homeworkId: string
  text: string
  authorId: string
  createdAt: string
  authorName?: string
}

export const useHomeworksApi = () => {
  const api = useApi()

  return {
    submit: (lessonId: string, courseId: string, solutionText?: string): Promise<Homework> =>
      api<Homework>('/homeworks/submit', {
        method: 'POST',
        body: { lessonId, courseId, solutionText },
      }),

    getStatus: (lessonId: string): Promise<Homework> =>
      api<Homework>(`/homeworks/status/${lessonId}`),

    getById: (homeworkId: string): Promise<Homework> =>
      api<Homework>(`/homeworks/detail/${homeworkId}`),

    updateStatus: (
      homeworkId: string,
      status: string,
      score?: number,
      feedback?: string,
    ): Promise<Homework> =>
      api<Homework>(`/homeworks/${homeworkId}/status`, {
        method: 'PATCH',
        body: { status, score, feedback },
      }),

    addComment: (homeworkId: string, text: string): Promise<HomeworkComment> =>
      api<HomeworkComment>(`/homeworks/${homeworkId}/comments`, {
        method: 'POST',
        body: { text },
      }),

    getPending: (): Promise<Homework[]> => api<Homework[]>('/homeworks/review/pending'),
    getUserHomeworks: (): Promise<Homework[]> => api<Homework[]>('/homeworks/student'),
    ensureChat: (studentId: string): Promise<{ homeworkId: string }> =>
      api<{ homeworkId: string }>(`/homeworks/ensure-chat/${studentId}`, {
        method: 'POST',
      }),
  }
}
