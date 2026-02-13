<template>
  <div
    class="h-screen flex flex-col bg-slate-50 text-slate-800 overflow-hidden font-nunito selection:bg-brand-green/30 relative"
  >
    <!-- MOBILE SIDEBAR OVERLAY -->
    <Transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
        @click="isSidebarOpen = false"
      ></div>
    </Transition>

    <!-- MAIN HEADER -->
    <header
      class="h-16 md:h-20 bg-white border-b-4 border-slate-100 px-4 md:px-8 flex items-center justify-between shrink-0 z-[110] shadow-sm"
    >
      <div class="flex items-center gap-3 md:gap-6 min-w-0">
        <button
          @click="isSidebarOpen = !isSidebarOpen"
          class="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-slate-200 lg:hidden"
        >
          <span class="text-xl">☰</span>
        </button>

        <NuxtLink
          to="/courses"
          class="hidden sm:flex w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl items-center justify-center border-4 border-slate-100 hover:translate-y-[-2px] transition-all"
        >
          <span class="text-lg">⬅️</span>
        </NuxtLink>

        <div class="flex flex-col min-w-0">
          <h1
            class="text-sm md:text-xl font-black text-slate-800 uppercase tracking-tight truncate max-w-[150px] sm:max-w-md"
          >
            {{ course?.title || 'Загрузка...' }}
          </h1>
          <div class="flex items-center gap-2">
            <div
              class="flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-500"
              :class="isSaving ? 'bg-brand-green/10 text-brand-green' : 'text-slate-300'"
            >
              <div
                class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                :class="isSaving ? 'bg-brand-green animate-pulse' : 'bg-slate-200'"
              ></div>
              <span class="text-[9px] font-black uppercase tracking-widest">
                {{ isSaving ? 'Синхронизация...' : 'Сохранено в облако' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <button
          @click="previewCourse"
          class="bg-slate-900 text-white px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest shadow-cartoon-sm hover:translate-y-[-2px] active:translate-y-[2px] transition-all"
        >
          Предпросмотр 👁️
        </button>
        <button
          @click="togglePublish"
          class="px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest hover:translate-y-[-2px] active:translate-y-[2px] transition-all"
          :class="
            course?.isPublished
              ? 'bg-brand-orange text-white shadow-cartoon-orange'
              : 'bg-brand-green text-white shadow-cartoon-green'
          "
        >
          {{ course?.isPublished ? 'В черновик 📥' : 'Опубликовать 🚀' }}
        </button>
      </div>
    </header>

    <div class="flex-grow flex overflow-hidden">
      <!-- NAVIGATION SIDEBAR -->
      <aside
        class="fixed inset-y-0 left-0 w-[300px] bg-white border-r-4 border-slate-100 z-[105] flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <ModuleList
          :modules="course?.modules || []"
          :selected-lesson-id="selectedLesson?.id"
          :has-intro="!!course?.introVideoUrl"
          @select-lesson="handleSelectLesson"
          @deselect="selectedLesson = null"
          @add-module="addModule"
          @delete-module="deleteModule"
          @add-lesson="addLesson"
          @toggle-preview="toggleLessonPreview"
          @close="isSidebarOpen = false"
        />
      </aside>

      <!-- CREATOR WORKSPACE -->
      <main class="flex-grow overflow-y-auto custom-scrollbar bg-slate-50 relative">
        <!-- Ambient Studio Accents -->
        <div
          class="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-blue/5 blur-[120px] pointer-events-none -z-10 rounded-full"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-green/5 blur-[120px] pointer-events-none -z-10 rounded-full"
        ></div>

        <div
          v-if="selectedLesson"
          class="p-6 md:p-14 max-w-[1600px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <!-- WORKSPACE GRID: Identity (L) + Cogitation (R) -->
          <div class="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-start">
            <!-- LEFT COLUMN: Primary Presence -->
            <div class="space-y-12">
              <LessonHeader
                :lesson="selectedLesson"
                :is-uploading="isUploading"
                :api-base="config.public.apiBase as string"
                @update:title="handleLessonFieldUpdate('title', $event)"
                @update:chapters="handleLessonFieldUpdate('chapters', $event)"
                @update:isPreview="handleLessonFieldUpdate('isPreview', $event)"
                @save="saveLesson"
                @delete="deleteLesson(selectedLesson.id)"
                @upload-video="performUpload"
                @delete-video="handleVideoDelete"
              />
            </div>

            <!-- RIGHT COLUMN: Detailed Design -->
            <div class="sticky top-10">
              <LessonTabs
                :lesson="selectedLesson"
                :is-generating-homework="isGeneratingHomework"
                @update:content-rich="handleLessonFieldUpdate('contentRich', $event)"
                @update:homework-title="handleLessonFieldUpdate('homeworkTitle', $event)"
                @update:homework-task="handleLessonFieldUpdate('homeworkTask', $event)"
                @update:homework-solution="handleLessonFieldUpdate('homeworkSolution', $event)"
                @update:conspectus-file="selectedLesson.conspectusFile = $event"
                @save="saveLesson"
                @trigger-upload="triggerFileUpload"
                @generate-homework-ai="handleGenerateHomework"
              >
                <template #quiz-content>
                  <QuizEditor
                    :questions="questions"
                    :is-generating-ai="isGeneratingAi"
                    @add-question="handleAddQuestion"
                    @update-question="updateQuestion"
                    @delete-question="handleDeleteQuestion"
                    @generate-ai="handleGenerateQuiz"
                  />
                </template>
              </LessonTabs>
            </div>
          </div>
        </div>

        <!-- IDLE STATE: The Drafting Board -->
        <template v-else>
          <BuilderIdleState
            :course="course"
            :is-uploading="isUploading"
            @update-course-settings="updateCourseSettings"
            @open-sidebar="isSidebarOpen = true"
            @intro-video-upload="
              (e: Event) => handleIntroVideoUpload(e, course, updateCourseSettings)
            "
            :get-full-video-url="getFullVideoUrl"
            :intro-video-input-ref="introVideoInput"
          />
        </template>
      </main>

      <!-- Generic File Input used by LessonTabs -->
      <input type="file" ref="genericFileInputEl" class="hidden" @change="handleFileUploadEvent" />
      <!-- Intro Video Input -->
      <input
        type="file"
        ref="introVideoInputEl"
        class="hidden"
        @change="(e: Event) => handleIntroVideoUpload(e, course, updateCourseSettings)"
        accept="video/*"
      />
    </div>

    <!-- QUALITY GUARD FEATURE -->
    <QualityGuard v-if="selectedLesson" :lesson="selectedLesson" :questions="questions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

import { useBuilderCourse } from '@features/course-builder/composables/useBuilderCourse'
import { useBuilderQuiz } from '@features/course-builder/composables/useBuilderQuiz'
import { useBuilderUpload } from '@features/course-builder/composables/useBuilderUpload'
import BuilderIdleState from '@features/course-builder/ui/BuilderIdleState.vue'
import LessonHeader from '@features/course-builder/ui/LessonHeader.vue'
import LessonTabs from '@features/course-builder/ui/LessonTabs.vue'
import ModuleList from '@features/course-builder/ui/ModuleList.vue'
import QualityGuard from '@features/course-builder/ui/QualityGuard.vue'
import QuizEditor from '@features/course-builder/ui/QuizEditor.vue'
import type { CommandAction } from '@shared/composables/useCommandPalette'
import { useCommandPalette } from '@shared/composables/useCommandPalette'
import { useModal } from '@shared/composables/useModal'
import type { Lesson } from '@shared/types'
import { debounce } from '@shared/utils/debounce'

const config = useRuntimeConfig()
const modal = useModal()
const palette = useCommandPalette()

// ── Composables ──────────────────────────────────────────
const {
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
} = useBuilderCourse()

const {
  isUploading,
  genericFileInput,
  introVideoInput,
  performUpload,
  handleVideoDelete,
  handleIntroVideoUpload,
  triggerFileUpload,
  handleFileUpload,
} = useBuilderUpload(selectedLesson, saveLesson)

const {
  questions,
  isGeneratingAi,
  isGeneratingHomework,
  fetchQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  generateAiQuiz,
  generateAiHomework,
} = useBuilderQuiz()

// ── Template Refs ────────────────────────────────────────
const genericFileInputEl = ref<HTMLInputElement | null>(null)
const introVideoInputEl = ref<HTMLInputElement | null>(null)
const isSidebarOpen = ref(false)

// Sync template refs with composable refs
watch(genericFileInputEl, (el) => {
  genericFileInput.value = el
})
watch(introVideoInputEl, (el) => {
  introVideoInput.value = el
})

// ── Autosave ─────────────────────────────────────────────
const autoSaveLesson = debounce(async () => {
  await saveLesson()
}, 1500)

const handleLessonFieldUpdate = <K extends keyof Lesson>(field: K, value: Lesson[K]) => {
  updateLessonField(field, value)
  autoSaveLesson()
}

// ── Quiz Wrappers ────────────────────────────────────────
const handleSelectLesson = (lesson: Lesson) => {
  selectLesson(lesson)
  fetchQuiz(lesson.id)
}

const handleAddQuestion = () => {
  if (!selectedLesson.value) return
  addQuestion(selectedLesson.value.id)
}

const handleDeleteQuestion = (id: string) => {
  deleteQuestion(id, modal.confirm)
}

const handleGenerateQuiz = () => {
  if (!selectedLesson.value) return
  generateAiQuiz(selectedLesson.value.id)
}

const handleGenerateHomework = () => {
  if (!selectedLesson.value) return
  generateAiHomework(selectedLesson.value.id, (result) => {
    if (!selectedLesson.value) return
    selectedLesson.value.homeworkTitle = result.homeworkTitle
    selectedLesson.value.homeworkTask = result.homeworkTask
    selectedLesson.value.homeworkSolution = result.homeworkSolution
  })
}

const handleFileUploadEvent = (event: Event) => {
  handleFileUpload(event, isSaving)
}

// ── Lifecycle ────────────────────────────────────────────
onMounted(async () => {
  await loadStructure()
})

// ── Command Palette Actions ──────────────────────────────
watch(
  [course, selectedLesson],
  ([newCourse, currentLesson]) => {
    if (!newCourse) return

    palette.clearActions()

    const actions: CommandAction[] = [
      {
        id: 'course-preview',
        title: 'Предпросмотр курса',
        subtitle: 'Открыть в полноэкранном режиме',
        icon: '👁️',
        category: 'system',
        handler: previewCourse,
      },
      {
        id: 'course-publish',
        title: newCourse.isPublished ? 'Вернуть в черновик' : 'Опубликовать курс',
        subtitle: 'Изменить статус видимости',
        icon: '🚀',
        category: 'system',
        handler: togglePublish,
      },
      {
        id: 'add-module',
        title: 'Добавить новый модуль',
        subtitle: 'Создать раздел курса',
        icon: '📦',
        category: 'content',
        handler: addModule,
      },
    ]

    if (currentLesson) {
      actions.push({
        id: 'ai-gen-quiz',
        title: 'Сгенерировать тест (ИИ)',
        subtitle: `На основе контента: ${currentLesson.title}`,
        icon: '🧠',
        category: 'content',
        handler: handleGenerateQuiz,
      })
      actions.push({
        id: 'ai-gen-homework',
        title: 'Создать задание (ИИ)',
        subtitle: `Методическая разработка: ${currentLesson.title}`,
        icon: '🤖',
        category: 'content',
        handler: handleGenerateHomework,
      })
    }

    newCourse.modules?.forEach((mod) => {
      mod.lessons.forEach((lesson) => {
        actions.push({
          id: `nav-lesson-${lesson.id}`,
          title: `Перейти: ${lesson.title}`,
          subtitle: `Модуль: ${mod.title}`,
          icon: '📄',
          category: 'navigation',
          handler: () => handleSelectLesson(lesson),
        })
      })
    })

    palette.registerActions(actions)
  },
  { immediate: true, deep: true },
)

definePageMeta({ layout: false, middleware: ['auth'] })
</script>

<style scoped>
@reference "tailwindcss";

/* Studio-specific input styles (only used on this page) */
.studio-input {
  @apply w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-2xl font-bold outline-none transition-all text-slate-700 shadow-inner;
}

.studio-input:focus {
  border-color: var(--color-brand-blue);
  background-color: white;
}

.studio-input-clean {
  @apply bg-transparent border-none outline-none font-black text-slate-700 w-full py-2;
}

.input-with-icon {
  @apply flex items-center gap-4 bg-slate-100/50 p-1.5 rounded-2xl border-2 border-transparent transition-all;
}

.input-with-icon:focus-within {
  border-color: var(--color-brand-blue);
  background-color: white;
}

.input-with-icon .icon {
  @apply w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg;
}

.transition-delay-500 {
  transition-delay: 500ms;
}
</style>
