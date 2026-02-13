<template>
  <div class="animate-in fade-in duration-700 bg-slate-50 min-h-screen pb-20">
    <div v-if="coursePending" class="h-screen flex flex-col items-center justify-center gap-6">
      <div
        class="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="font-black text-slate-400 uppercase tracking-widest text-xs">
        Загружаем мир знаний...
      </p>
    </div>

    <div
      v-else-if="error"
      class="h-screen flex flex-col items-center justify-center gap-6 p-8 text-center"
    >
      <div class="text-6xl">😱</div>
      <AppHeading level="h2" size="md" center uppercase>Ой! Ошибка загрузки</AppHeading>
      <p class="text-slate-500 font-bold max-w-md">{{ error }}</p>
      <AppButton variant="secondary" size="lg" @click="fetchCourse(route.params.id as string)">
        ПОПРОБОВАТЬ СНОВА
      </AppButton>
    </div>

    <div v-else-if="course" class="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
      <!-- Header Navigation -->
      <nav
        class="flex items-center justify-between bg-white p-4 rounded-3xl border-4 border-slate-100 shadow-sm"
      >
        <NuxtLink
          to="/courses"
          class="flex items-center gap-3 font-black text-slate-400 hover:text-brand-blue transition-colors text-xs uppercase tracking-widest"
        >
          <span class="text-lg">⬅️</span> Назад в лощину
        </NuxtLink>
        <div class="flex items-center gap-4">
          <div class="hidden md:flex flex-col items-end">
            <span
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"
              >Ты проходишь:</span
            >
            <span class="text-sm font-black text-slate-800">{{ course.title }}</span>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-xl"
          >
            🐍
          </div>
        </div>
      </nav>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative">
        <!-- Main Stage -->
        <div class="xl:col-span-8 space-y-8">
          <!-- Cinema Mode Player -->
          <LessonPlayer
            v-if="playerSource.videoUrl"
            :video-url="playerSource.videoUrl"
            :chapters="playerSource.chapters"
          />

          <!-- Content Tabs -->
          <LessonTabsContainer v-model="activeTab">
            <!-- Access Locked State for non-enrolled students -->
            <EnrollmentPrompt
              v-if="!course.isEnrolled"
              :current-lesson="currentLesson"
              :is-enrolling="isEnrolling"
              :price="course.price"
              :mentoring-price="course.mentoringPrice"
              :format-file-url="formatFileUrl"
              @enroll="handleEnroll"
            />

            <!-- Enroll-Only Content -->
            <template v-else>
              <!-- Conspectus View -->
              <LessonMaterials
                v-show="activeTab === 'Материалы'"
                :current-lesson="currentLesson"
                :format-file-url="formatFileUrl"
              />

              <!-- REAL DEV: Practice Area -->
              <ErrorBoundary v-show="activeTab === 'Практика'">
                <LessonPractice
                  v-model:solution="solution"
                  :current-lesson="currentLesson"
                  :is-submitting="isSubmitting"
                  :format-file-url="formatFileUrl"
                  @submit="submitSolution"
                />
              </ErrorBoundary>

              <!-- Discussion Area -->
              <div
                v-show="activeTab === 'Обсуждение'"
                class="animate-in fade-in duration-300 min-h-[400px]"
              >
                <ClientOnly>
                  <div v-if="currentHomework">
                    <HomeworkDiscussion
                      :homework="currentHomework"
                      @refresh="fetchHomeworkStatus"
                    />
                  </div>
                  <AppEmptyState
                    v-else
                    icon="💬"
                    title="Обсуждение закрыто"
                    description="Отправьте решение, чтобы открыть чат с учителем"
                  />
                </ClientOnly>
              </div>
            </template>
          </LessonTabsContainer>
        </div>

        <!-- Sidebar -->
        <CourseSidebar
          v-if="course"
          :course="course"
          :current-lesson="currentLesson"
          @select="selectLesson"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'
import { ref, onMounted, watch } from 'vue'

definePageMeta({ layout: 'main', middleware: ['auth'] })

import type { Lesson, Module } from '@entities/course/model/types'
import { useCourse } from '@entities/course/model/useCourse'
import CourseSidebar from '@features/course/ui/CourseSidebar.vue'
import EnrollmentPrompt from '@features/course/ui/EnrollmentPrompt.vue'
import LessonMaterials from '@features/course/ui/LessonMaterials.vue'
import LessonPlayer from '@features/course/ui/LessonPlayer.vue'
import LessonPractice from '@features/course/ui/LessonPractice.vue'
import LessonTabsContainer from '@features/course/ui/LessonTabsContainer.vue'
import { useHomeworkFlow } from '@features/homeworks/model/useHomeworkFlow'
import HomeworkDiscussion from '@features/homeworks/ui/HomeworkDiscussion.vue'
import { useToast } from '@shared/composables/useToast'
import AppButton from '@shared/ui/AppButton.vue'
import AppEmptyState from '@shared/ui/AppEmptyState.vue'
import AppHeading from '@shared/ui/AppHeading.vue'
import ErrorBoundary from '@shared/ui/ErrorBoundary.vue'
import { formatFileUrl } from '@shared/utils/url'

const route = useRoute()
const toast = useToast()

const {
  course,
  currentLesson,
  isPending: coursePending,
  isEnrolling,
  error,
  fetchCourse,
  handleEnroll: enrollAction,
  selectLesson: selectLessonAction,
} = useCourse()

const {
  currentHomework,
  isSubmitting,
  solution,
  fetchHomeworkStatus,
  submitSolution: submitAction,
  resetSolution,
} = useHomeworkFlow()

const playerSource = computed(() => {
  if (!course.value) return { videoUrl: null, chapters: null }

  // If user is enrolled, show lesson content
  if (course.value.isEnrolled) {
    return {
      videoUrl: currentLesson.value?.videoUrl || null,
      chapters: currentLesson.value?.chapters || null,
    }
  }

  // For non-enrolled users: Main stage ALWAYS features the Trailer (Intro Video)
  return {
    videoUrl: course.value.introVideoUrl || null,
    chapters: null,
  }
})

const activeTab = ref('Материалы')

onMounted(async () => {
  await fetchCourse(route.params.id as string)

  // Handle deep-linking to a specific lesson via query param
  if (route.query.lesson && course.value?.modules) {
    const allLessons = course.value.modules.flatMap((m: Module) => m.lessons || [])
    const targetLesson = allLessons.find((l: Lesson) => l.id === route.query.lesson)
    if (targetLesson) {
      selectLessonAction(targetLesson)
    }
  }
})

const selectLesson = async (lesson: Lesson) => {
  selectLessonAction(lesson)
  resetSolution()
}

const handleEnroll = async () => {
  const success = await enrollAction()
  if (success) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    })
  } else {
    toast.error('Не удалось записаться на курс. Попробуй позже.')
  }
}

const submitSolution = async () => {
  if (!currentLesson.value || !course.value) return

  const success = await submitAction(currentLesson.value.id, course.value.id)
  if (success) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#F59E0B'],
    })
    toast.success('Решение отправлено на проверку! 🚀')
  } else {
    toast.error('Ошибка при отправке решения')
  }
}

watch(currentLesson, (newLesson) => {
  if (newLesson) fetchHomeworkStatus(newLesson.id)
})
</script>
