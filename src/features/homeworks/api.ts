import { useApi } from '~/shared/api'
import type { Homework } from '~/shared/types'

export const useHomeworksApi = () => {
  const api = useApi()

  return {
    submit: (lessonId: string, courseId: string, solutionText?: string) =>
      api<Homework>('/homeworks/submit', {
        method: 'POST',
        body: { lessonId, courseId, solutionText },
      }),

    getStatus: (lessonId: string) => api<Homework>(`/homeworks/status/${lessonId}`),

    getById: (homeworkId: string) => api<Homework>(`/homeworks/detail/${homeworkId}`),

    updateStatus: (homeworkId: string, status: string, score?: number, feedback?: string) =>
      api(`/homeworks/${homeworkId}/status`, {
        method: 'PATCH',
        body: { status, score, feedback },
      }),

    addComment: (homeworkId: string, text: string) =>
      api(`/homeworks/${homeworkId}/comments`, {
        method: 'POST',
        body: { text },
      }),
  }
}
