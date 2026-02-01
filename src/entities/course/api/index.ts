import { useApi } from '~/shared/api'
import type { Course } from '~/shared/types'

export const useCourseApi = () => {
  const api = useApi()

  return {
    getCourses: (): Promise<Course[]> => api('/courses'),
    getCourse: (id: string): Promise<Course> => api(`/courses/${id}`),
    createCourse: (data: Partial<Course>): Promise<Course> =>
      api('/courses', { method: 'POST', body: data }),
    updateCourse: (id: string, data: Partial<Course>): Promise<Course> =>
      api(`/courses/${id}`, { method: 'PATCH', body: data }),
    deleteCourse: (id: string): Promise<void> => api(`/courses/${id}`, { method: 'DELETE' }),
  }
}
