import { ref } from 'vue'

import { usePaymentApi } from '@entities/payment/api'
import type { Course, Lesson, Module } from '@shared/types'

import { useCourseApi } from '../api'

export const useCourse = () => {
  const { getCourse } = useCourseApi()
  const { createPayment } = usePaymentApi()

  const course = ref<Course | null>(null)
  const currentLesson = ref<Lesson | null>(null)
  const isPending = ref(true)
  const isEnrolling = ref(false)
  const error = ref<string | null>(null)

  const fetchCourse = async (id: string, silent = false) => {
    if (!silent) isPending.value = true
    error.value = null
    try {
      const data = await getCourse(id)
      course.value = data
      // Auto-select first lesson if none selected
      if (!currentLesson.value && data.modules?.length) {
        // For non-enrolled users, prefer first preview lesson
        if (!data.isEnrolled) {
          const allLessons = data.modules.flatMap((m: Module) => m.lessons || [])
          const previewLesson = allLessons.find((l: Lesson) => l.isPreview)
          currentLesson.value = previewLesson || allLessons[0] || null
        } else {
          currentLesson.value = data.modules[0]?.lessons?.[0] || null
        }
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      error.value = apiErr.message || 'Failed to load course'
    } finally {
      if (!silent) isPending.value = false
    }
  }

  const handleEnroll = async () => {
    if (!course.value) return
    const courseId = course.value.id
    isEnrolling.value = true
    try {
      const res = await createPayment(courseId)

      if (res.status === 'SUCCEEDED') {
        if (course.value) {
          course.value.isEnrolled = true
        }
        await fetchCourse(courseId, true)
        return true
      }

      if (res.status === 'PENDING' && res.checkoutUrl) {
        await navigateTo(res.checkoutUrl)
        return true
      }

      return false
    } catch {
      return false
    } finally {
      isEnrolling.value = false
    }
  }

  const selectLesson = (lesson: Lesson) => {
    currentLesson.value = lesson
  }

  return {
    course,
    currentLesson,
    isPending,
    isEnrolling,
    error,
    fetchCourse,
    handleEnroll,
    selectLesson,
  }
}
