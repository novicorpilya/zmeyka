import { useApi } from '@shared/api'

export const useCourseApi = () => {
    const { fetchApi } = useApi()

    return {
        getCourses: () => fetchApi('/courses'),
        getCourse: (id: string) => fetchApi(`/courses/${id}`),
        createCourse: (data: any) => fetchApi('/courses', { method: 'POST', body: data }),
        updateCourse: (id: string, data: any) => fetchApi(`/courses/${id}`, { method: 'PATCH', body: data }),
        deleteCourse: (id: string) => fetchApi(`/courses/${id}`, { method: 'DELETE' }),
    }
}
