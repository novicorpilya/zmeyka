import { ref } from 'vue'

import { useBuilderApi } from '~/features/course-builder/api'
import { useModal } from '~/shared/composables/useModal'
import { useToast } from '~/shared/composables/useToast'
import type { Course, Lesson } from '~/shared/types'

/**
 * Composable for course builder CRUD operations:
 * - Load course structure
 * - Update course settings
 * - Add/delete modules
 * - Add/delete/save lessons
 * - Toggle publish/preview states
 */
export const useBuilderCourse = () => {
  const builderApi = useBuilderApi()
  const toast = useToast()
  const modal = useModal()
  const config = useRuntimeConfig()
  const route = useRoute()

  const course = ref<Course | null>(null)
  const selectedLesson = ref<Lesson | null>(null)
  const isSaving = ref(false)

  const loadStructure = async () => {
    try {
      const data = await builderApi.getStructure(route.params.id as string)
      course.value = data
    } catch (_err) {
      // silent — page shows empty state
    }
  }

  const updateCourseSettings = async () => {
    if (!course.value) return
    isSaving.value = true
    try {
      await builderApi.updateCourse(course.value.id, {
        title: course.value.title,
        plannedLessonsCount: course.value.plannedLessonsCount,
        level: course.value.level,
        price: course.value.price,
        mentoringPrice: course.value.mentoringPrice,
        introVideoUrl: course.value.introVideoUrl,
      })
      toast.success('Настройки курса сохранены')
    } catch (_err) {
      toast.error('Ошибка при сохранении настроек')
    } finally {
      isSaving.value = false
    }
  }

  const togglePublish = async () => {
    if (!course.value) return
    isSaving.value = true
    try {
      const newStatus = !course.value.isPublished
      await builderApi.updateCourse(course.value.id, { isPublished: newStatus })
      course.value.isPublished = newStatus
    } catch (_err) {
      toast.error('Ошибка при обновлении статуса курса')
    } finally {
      isSaving.value = false
    }
  }

  const previewCourse = () => {
    if (!course.value) return
    modal.show({
      title: `Предпросмотр: ${course.value.title}`,
      type: 'preview',
      url: `/courses/${course.value.id}`,
    })
  }

  const addModule = async () => {
    if (!course.value) return
    const title = (await modal.prompt('Новый модуль', 'Введите название модуля...')) as
      | string
      | undefined
    if (!title) return
    await builderApi.createModule({
      title,
      courseId: course.value.id,
      order: Number(course.value.modules?.length || 0) + 1,
    })
    await loadStructure()
  }

  const addLesson = async (moduleId: string) => {
    if (!course.value?.modules) return
    const title = (await modal.prompt('Новый урок', 'Введите название урока...')) as
      | string
      | undefined
    if (!title) return
    const mod = course.value.modules.find((m) => m.id === moduleId)
    if (!mod) return
    const newL = await builderApi.createLesson({
      title,
      moduleId,
      order: Number(mod.lessons?.length || 0) + 1,
    })
    await loadStructure()
    selectLesson(newL)
  }

  const deleteModule = async (id: string) => {
    if (await modal.confirm('Удалить модуль?', 'Все уроки внутри также будут удалены!')) {
      await builderApi.deleteModule(id)
      await loadStructure()
    }
  }

  const deleteLesson = async (id: string) => {
    if (await modal.confirm('Удалить урок?', 'Вы уверены, что хотите стереть этот урок?')) {
      const lessonToDelete = course.value?.modules
        ?.flatMap((m) => m.lessons)
        .find((l) => l.id === id)
      const moduleId = course.value?.modules?.find((m) => m.lessons.some((l) => l.id === id))?.id

      await builderApi.deleteLesson(id)
      await loadStructure()
      if (selectedLesson.value?.id === id) selectedLesson.value = null

      toast.success('Урок удален', 5000, {
        label: 'Отменить',
        handler: async () => {
          if (lessonToDelete && moduleId) {
            const res = await builderApi.createLesson({
              title: lessonToDelete.title,
              moduleId,
              order: lessonToDelete.order,
            })
            await builderApi.updateLesson(res.id, {
              contentRich: lessonToDelete.contentRich,
              videoUrl: lessonToDelete.videoUrl,
              homeworkTitle: lessonToDelete.homeworkTitle,
              homeworkTask: lessonToDelete.homeworkTask,
              homeworkSolution: lessonToDelete.homeworkSolution,
              chapters: lessonToDelete.chapters,
            })
            await loadStructure()
            toast.info('Урок восстановлен')
          }
        },
      })
    }
  }

  const toggleLessonPreview = async (lesson: Lesson) => {
    try {
      const newStatus = !lesson.isPreview
      await builderApi.updateLesson(lesson.id, { isPreview: newStatus })

      if (course.value?.modules) {
        course.value.modules.forEach((m) => {
          const l = m.lessons.find((it) => it.id === lesson.id)
          if (l) l.isPreview = newStatus
        })
      }

      if (selectedLesson.value?.id === lesson.id) {
        selectedLesson.value.isPreview = newStatus
      }

      toast.success(newStatus ? 'Урок добавлен в превью ✨' : 'Урок убран из превью 💎')
    } catch (_err) {
      toast.error('Ошибка при обновлении статуса превью')
    }
  }

  const selectLesson = (lesson: Lesson) => {
    selectedLesson.value = { ...lesson }
  }

  const saveLesson = async () => {
    if (!selectedLesson.value || !course.value) return
    isSaving.value = true
    try {
      const payload = {
        title: selectedLesson.value.title,
        contentRich: selectedLesson.value.contentRich,
        videoUrl: selectedLesson.value.videoUrl,
        homeworkTitle: selectedLesson.value.homeworkTitle,
        homeworkTask: selectedLesson.value.homeworkTask,
        conspectusFile: selectedLesson.value.conspectusFile,
        homeworkFile: selectedLesson.value.homeworkFile,
        homeworkSolution: selectedLesson.value.homeworkSolution,
        chapters: selectedLesson.value.chapters,
        isPreview: selectedLesson.value.isPreview,
      }
      await builderApi.updateLesson(selectedLesson.value.id, payload)

      // Update the lesson in the course structure to reflect changes
      if (course.value.modules) {
        const mod = course.value.modules.find((m) =>
          m.lessons.some((l) => l.id === selectedLesson.value?.id),
        )
        if (mod) {
          const lIdx = mod.lessons.findIndex((l) => l.id === selectedLesson.value?.id)
          if (lIdx !== -1) {
            mod.lessons[lIdx] = { ...selectedLesson.value } as Lesson
          }
        }
      }
      toast.success('Изменения сохранены', 2000)
    } catch (err: unknown) {
      const apiErr = err as { data?: unknown }
      if (import.meta.dev && apiErr.data) {
        console.error('[CourseBuilder] Server error details:', JSON.stringify(apiErr.data, null, 2))
      }
      toast.error('Не удалось сохранить изменения')
    } finally {
      setTimeout(() => (isSaving.value = false), 500)
    }
  }

  const updateLessonField = <K extends keyof Lesson>(field: K, value: Lesson[K]) => {
    if (!selectedLesson.value) return
    selectedLesson.value[field] = value
  }

  const getFullVideoUrl = (url: string) => {
    if (url.startsWith('http')) return url
    try {
      const base = new URL(config.public.apiBase as string)
      return `${base.origin}${url}`
    } catch (_e) {
      return url
    }
  }

  return {
    course,
    selectedLesson,
    isSaving,
    loadStructure,
    updateCourseSettings,
    togglePublish,
    previewCourse,
    addModule,
    addLesson,
    deleteModule,
    deleteLesson,
    toggleLessonPreview,
    selectLesson,
    saveLesson,
    updateLessonField,
    getFullVideoUrl,
  }
}
