import { ref } from 'vue'

import { useHomeworksApi } from '@entities/homework/api'
import type { Homework } from '@shared/types'

export const useHomeworkFlow = () => {
  const homeworksApi = useHomeworksApi()

  const currentHomework = ref<Homework | null>(null)
  const isSubmitting = ref(false)
  const isPending = ref(false)
  const solution = ref('')

  const fetchHomeworkStatus = async (lessonId: string) => {
    isPending.value = true
    try {
      const data = await homeworksApi.getStatus(lessonId)
      currentHomework.value = data

      // AUTO-RETRY LOGIC: If AI is still checking, poll again in 3 seconds
      if (data?.status === 'CHECKING') {
        setTimeout(() => {
          // Only poll if we are still on the same lesson (basic check)
          if (currentHomework.value?.lessonId === lessonId) {
            fetchHomeworkStatus(lessonId)
          }
        }, 3000)
      }
    } catch (err) {
      currentHomework.value = null
    } finally {
      isPending.value = false
    }
  }

  const submitSolution = async (lessonId: string, courseId: string) => {
    if (!solution.value) return false

    isSubmitting.value = true
    try {
      await homeworksApi.submit(lessonId, courseId, solution.value)
      await fetchHomeworkStatus(lessonId)
      return true
    } catch {
      // Submission failed
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const resetSolution = () => {
    solution.value = ''
  }

  return {
    currentHomework,
    isSubmitting,
    isPending,
    solution,
    fetchHomeworkStatus,
    submitSolution,
    resetSolution,
  }
}
