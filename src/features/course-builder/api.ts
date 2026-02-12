import { useApi } from '~/shared/api'
import type { Course, Module, Lesson, Quiz, Question } from '~/shared/types'

export const useBuilderApi = () => {
  const api = useApi()

  const getStructure = async (courseId: string): Promise<Course> => {
    return await api(`/builder/course/${courseId}`)
  }

  const updateCourse = async (id: string, data: Partial<Course>): Promise<Course> => {
    return await api(`/courses/${id}`, { method: 'PATCH', body: data })
  }

  const createModule = async (data: {
    title: string
    courseId: string
    order: number
  }): Promise<Module> => {
    return await api('/builder/modules', { method: 'POST', body: data })
  }

  const updateModule = async (id: string, data: Partial<Module>): Promise<Module> => {
    return await api(`/builder/modules/${id}`, { method: 'PATCH', body: data })
  }

  const deleteModule = async (id: string): Promise<void> => {
    return await api(`/builder/modules/${id}`, { method: 'DELETE' })
  }

  const createLesson = async (data: {
    title: string
    moduleId: string
    order: number
  }): Promise<Lesson> => {
    return await api('/builder/lessons', { method: 'POST', body: data })
  }

  const updateLesson = async (id: string, data: Partial<Lesson>): Promise<Lesson> => {
    return await api(`/builder/lessons/${id}`, { method: 'PATCH', body: data })
  }

  const deleteLesson = async (id: string): Promise<void> => {
    return await api(`/builder/lessons/${id}`, { method: 'DELETE' })
  }

  const reorder = async (
    type: 'module' | 'lesson',
    orders: { id: string; order: number }[],
  ): Promise<void> => {
    return await api(`/builder/reorder/${type}`, { method: 'PATCH', body: orders })
  }

  const uploadVideo = async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return await api('/upload/video', {
      method: 'POST',
      body: formData,
    })
  }

  const uploadFile = async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return await api('/upload/file', {
      method: 'POST',
      body: formData,
    })
  }

  const deleteVideo = async (filename: string): Promise<void> => {
    return await api(`/upload/video/${filename}`, { method: 'DELETE' })
  }

  const deleteFile = async (filename: string): Promise<void> => {
    return await api(`/upload/file/${filename}`, { method: 'DELETE' })
  }

  const getQuiz = async (lessonId: string): Promise<Quiz> => {
    return await api(`/builder/quiz/${lessonId}`)
  }

  const ensureQuiz = async (lessonId: string): Promise<Quiz> => {
    return await api(`/builder/quiz/${lessonId}/ensure`, { method: 'POST' })
  }

  const addQuestion = async (
    quizId: string,
    data: { text: string; options: string; correctOption: number },
  ): Promise<Question> => {
    return await api(`/builder/quiz/${quizId}/questions`, { method: 'POST', body: data })
  }

  const updateQuestion = async (
    id: string,
    data: { text?: string; options?: string; correctOption?: number },
  ): Promise<Question> => {
    return await api(`/builder/questions/${id}`, { method: 'PATCH', body: data })
  }

  const deleteQuestion = async (id: string): Promise<void> => {
    return await api(`/builder/questions/${id}`, { method: 'DELETE' })
  }

  const generateAiQuiz = async (lessonId: string): Promise<Question[]> => {
    return await api(`/builder/ai/generate-quiz/${lessonId}`, { method: 'POST' })
  }

  const generateAiHomework = async (lessonId: string): Promise<Lesson> => {
    return await api(`/builder/ai/generate-homework/${lessonId}`, { method: 'POST' })
  }

  return {
    getStructure,
    updateCourse,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
    reorder,
    uploadVideo,
    uploadFile,
    deleteVideo,
    deleteFile,
    getQuiz,
    ensureQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    generateAiQuiz,
    generateAiHomework,
  }
}
