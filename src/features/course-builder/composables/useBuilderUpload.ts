import { ref } from 'vue'

import { useBuilderApi } from '~/features/course-builder/api'
import { useModal } from '~/shared/composables/useModal'
import { useToast } from '~/shared/composables/useToast'
import type { Lesson } from '~/shared/types'

/**
 * Composable for file and video upload operations in the course builder.
 */
export const useBuilderUpload = (
  selectedLesson: ReturnType<typeof ref<Lesson | null>>,
  saveLesson: () => Promise<void>,
) => {
  const builderApi = useBuilderApi()
  const toast = useToast()
  const modal = useModal()

  const isUploading = ref(false)
  const genericFileInput = ref<HTMLInputElement | null>(null)
  const introVideoInput = ref<HTMLInputElement | null>(null)
  const uploadTarget = ref<'conspectus' | 'homework' | null>(null)

  const performUpload = async (file: File) => {
    if (!selectedLesson.value) return
    isUploading.value = true
    try {
      const { url } = await builderApi.uploadVideo(file)
      selectedLesson.value.videoUrl = url
      await saveLesson()
    } catch (_err) {
      // silent
    } finally {
      isUploading.value = false
    }
  }

  const handleVideoDelete = async () => {
    if (!selectedLesson.value || !selectedLesson.value.videoUrl) return
    if (!(await modal.confirm('Удаление видео', 'Это действие физически удалит файл. Вы уверены?')))
      return

    const filename = selectedLesson.value.videoUrl.split('/').pop()
    if (filename) {
      try {
        await builderApi.deleteVideo(filename)
      } catch (err) {
        if (import.meta.dev) console.error('Failed to delete physical file:', err)
      }
    }

    selectedLesson.value.videoUrl = undefined
    await saveLesson()
  }

  const handleIntroVideoUpload = async (
    event: Event,
    course: { introVideoUrl?: string | null } | null,
    updateCourseSettings: () => Promise<void>,
  ) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file || !course) return

    isUploading.value = true
    try {
      const { url } = await builderApi.uploadVideo(file)
      course.introVideoUrl = url
      await updateCourseSettings()
      toast.success('Приветственное видео успешно загружено 🚀')
    } catch (_err) {
      toast.error('Не удалось загрузить видео')
    } finally {
      isUploading.value = false
    }
  }

  const triggerFileUpload = (target: 'conspectus' | 'homework') => {
    uploadTarget.value = target
    genericFileInput.value?.click()
  }

  const handleFileUpload = async (event: Event, isSaving: { value: boolean }) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file || !selectedLesson.value || !uploadTarget.value) return

    isSaving.value = true
    try {
      const { url } = await builderApi.uploadFile(file)
      if (uploadTarget.value === 'conspectus') selectedLesson.value.conspectusFile = url
      else selectedLesson.value.homeworkFile = url
      await saveLesson()
    } catch (_err) {
      // silent
    } finally {
      isSaving.value = false
    }
  }

  return {
    isUploading,
    genericFileInput,
    introVideoInput,
    uploadTarget,
    performUpload,
    handleVideoDelete,
    handleIntroVideoUpload,
    triggerFileUpload,
    handleFileUpload,
  }
}
