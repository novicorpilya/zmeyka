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
          <div
            v-if="isSaving"
            class="flex items-center gap-1 text-[8px] md:text-[10px] text-brand-green font-black"
          >
            <span
              class="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"
            ></span>
            СОХРАНЕНИЕ
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
        <div
          class="p-6 md:p-8 border-b-4 border-slate-100 flex items-center justify-between shrink-0"
        >
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest"
            >ПРОГРАММА КУРСА</span
          >
          <button @click="isSidebarOpen = false" class="lg:hidden text-slate-400">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
          <div v-for="(mod, mIdx) in course?.modules" :key="mod.id" class="space-y-4">
            <!-- Module Slot -->
            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div
                  class="w-7 h-7 rounded-lg bg-brand-blue text-white flex items-center justify-center text-[10px] font-black shadow-sm"
                >
                  {{ mIdx + 1 }}
                </div>
                <span class="font-black text-xs text-slate-800 uppercase tracking-tight">{{
                  mod.title
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="deleteModule(mod.id)"
                  class="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-xs"
                >
                  ×
                </button>
                <button
                  @click="addLesson(mod.id)"
                  class="text-brand-green hover:scale-110 transition-transform"
                >
                  ⊕
                </button>
              </div>
            </div>

            <!-- Lessons List -->
            <div class="ml-3 pl-4 border-l-4 border-slate-50 space-y-2">
              <div
                v-for="lesson in mod.lessons"
                :key="lesson.id"
                @click="
                  selectLesson(lesson);
                  isSidebarOpen = false;
                "
                class="p-3 rounded-xl transition-all cursor-pointer border-2 font-black text-[11px] uppercase tracking-tight"
                :class="
                  selectedLesson?.id === lesson.id
                    ? 'bg-brand-blue/5 border-brand-blue/20 text-brand-blue shadow-sm'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'
                "
              >
                {{ lesson.title }}
              </div>
            </div>
          </div>

          <button
            @click="addModule"
            class="w-full py-4 border-4 border-dashed border-slate-100 rounded-2xl font-black text-[10px] text-slate-300 uppercase tracking-widest hover:border-brand-blue/30 hover:text-brand-blue transition-all"
          >
            + Добавить модуль
          </button>
        </div>
      </aside>

      <!-- CREATOR WORKSPACE -->
      <main class="flex-grow overflow-y-auto custom-scrollbar bg-slate-50">
        <div
          v-if="selectedLesson"
          class="p-4 md:p-10 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500"
        >
          <!-- SECTION 1: IDENTITY & MEDIA -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12">
            <!-- Lesson Title Block -->
            <div class="space-y-6">
              <div
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-yellow/10 text-brand-yellow-800 rounded-lg text-[10px] font-black uppercase tracking-widest"
              >
                <span class="animate-pulse">✨</span> Редактирование урока
              </div>
              <textarea
                v-model="selectedLesson.title"
                @input="autoSaveLesson"
                @blur="saveLesson"
                rows="2"
                class="w-full bg-transparent text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 border-none outline-none focus:text-brand-blue transition-all placeholder:text-slate-200 leading-[0.9] tracking-tighter resize-none"
                placeholder="Название урока..."
              ></textarea>

              <div class="flex items-center gap-4">
                <button
                  @click="deleteLesson(selectedLesson.id)"
                  class="text-[10px] font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                >
                  Удалить урок ×
                </button>
                <div class="h-1 w-1 rounded-full bg-slate-300"></div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >ID: {{ selectedLesson.id.slice(0, 8) }}</span
                >
              </div>
            </div>

            <!-- Media Engine Block -->
            <div
              class="aspect-video bg-white rounded-[2.5rem] md:rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden transition-all relative group"
              :class="[
                isUploading ? 'opacity-50 pointer-events-none' : '',
                !selectedLesson.videoUrl
                  ? 'flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue/20'
                  : '',
              ]"
              @click="!selectedLesson.videoUrl && triggerUpload()"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <template v-if="selectedLesson.videoUrl">
                <video
                  :src="getFullUrl(selectedLesson.videoUrl)"
                  controls
                  class="w-full h-full object-cover"
                ></video>
                <!-- Dedicated Replace Button -->
                <button
                  @click.stop="triggerUpload"
                  class="absolute top-4 right-4 md:top-8 md:right-8 px-6 py-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl text-[10px] font-black text-slate-800 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-blue hover:text-white border-2 border-slate-100"
                >
                  Сменить видео 🔄
                </button>
              </template>
              <template v-else>
                <div class="text-center p-8 space-y-4">
                  <div class="text-5xl md:text-6xl animate-float">🎞️</div>
                  <div class="space-y-1">
                    <h3
                      class="font-black text-sm md:text-xl text-slate-800 uppercase tracking-tight"
                    >
                      Загрузите видео
                    </h3>
                    <p
                      class="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                    >
                      MP4 / MOV / AVI (max 100MB)
                    </p>
                  </div>
                </div>
              </template>

              <div
                v-if="isUploading"
                class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-20"
              >
                <div class="flex flex-col items-center gap-4">
                  <div
                    class="w-12 h-12 border-8 border-brand-green border-t-transparent rounded-full animate-spin"
                  ></div>
                  <p class="text-xl font-black text-slate-800 uppercase">
                    ЗАГРУЗКА: {{ uploadProgress }}%
                  </p>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              @change="handleFileChange"
              accept="video/*"
            />
          </div>

          <!-- SECTION 2: CONTENT COGITATION -->
          <div
            class="bg-white rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden transition-all flex flex-col min-h-[600px]"
          >
            <!-- Tab Bar -->
            <div class="flex border-b-4 border-slate-50 bg-slate-50/50">
              <button
                v-for="tab in ['Конспект', 'Домашнее Задание', 'Тесты']"
                :key="tab"
                @click="activeTab = tab"
                class="px-8 py-6 font-black text-[11px] md:text-xs uppercase tracking-[0.2em] transition-all relative"
                :class="
                  activeTab === tab
                    ? 'text-brand-blue bg-white'
                    : 'text-slate-400 hover:text-slate-600'
                "
              >
                {{ tab }}
                <div
                  v-if="activeTab === tab"
                  class="absolute bottom-[-4px] left-0 right-0 h-1 bg-brand-blue z-10"
                ></div>
              </button>
            </div>

            <!-- Editor Surface -->
            <div class="flex-grow p-6 md:p-12 overflow-y-auto no-scrollbar">
              <div
                v-if="activeTab === 'Конспект'"
                class="animate-in slide-in-from-bottom-2 duration-400 h-full flex flex-col gap-6"
              >
                <div
                  class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 transition-all"
                  :class="{ 'border-brand-green bg-brand-green/5': selectedLesson.conspectusFile }"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">{{ selectedLesson.conspectusFile ? '📄' : '📎' }}</span>
                    <div class="flex flex-col">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                        >Дополнительный файл</span
                      >
                      <span class="text-xs font-bold text-slate-700">{{
                        selectedLesson.conspectusFile
                          ? 'Файл прикреплен'
                          : 'Нет прикрепленного файла'
                      }}</span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      v-if="selectedLesson.conspectusFile"
                      @click="
                        selectedLesson.conspectusFile = undefined;
                        saveLesson();
                      "
                      class="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      Удалить
                    </button>
                    <button
                      @click="triggerFileUpload('conspectus')"
                      class="px-4 py-1.5 bg-white border-2 border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-brand-blue transition-all"
                    >
                      {{ selectedLesson.conspectusFile ? 'Заменить' : 'Прикрепить PDF/Doc' }}
                    </button>
                  </div>
                </div>
                <textarea
                  v-model="selectedLesson.contentRich"
                  @input="autoSaveLesson"
                  @blur="saveLesson"
                  class="w-full flex-grow bg-transparent border-none outline-none font-bold text-base md:text-xl text-slate-600 leading-relaxed placeholder:text-slate-200 resize-none"
                  placeholder="Начни писать интерактивный конспект. Поддерживается Markdown."
                ></textarea>
              </div>

              <div
                v-if="activeTab === 'Домашнее Задание'"
                class="space-y-10 animate-in slide-in-from-bottom-2 duration-400"
              >
                <div class="space-y-4">
                  <label class="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em]"
                    >Заголовок задачи (H1)</label
                  >
                  <input
                    v-model="selectedLesson.homeworkTitle"
                    @input="autoSaveLesson"
                    @blur="saveLesson"
                    placeholder="Напр: Создаем змейку на классах"
                    class="w-full bg-slate-50 border-4 border-transparent focus:border-brand-orange/20 p-6 rounded-2xl font-black text-xl md:text-2xl outline-none transition-all"
                  />
                </div>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <label
                      class="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em]"
                      >Текст задания (Инструкция)</label
                    >
                    <button
                      @click="triggerFileUpload('homework')"
                      class="text-[10px] font-black transition-colors uppercase tracking-widest flex items-center gap-2"
                      :class="
                        selectedLesson.homeworkFile
                          ? 'text-brand-green'
                          : 'text-slate-400 hover:text-brand-blue'
                      "
                    >
                      {{
                        selectedLesson.homeworkFile
                          ? 'Шаблон прикреплен ✓'
                          : 'Прикрепить шаблон кода 📎'
                      }}
                    </button>
                  </div>
                  <textarea
                    v-model="selectedLesson.homeworkTask"
                    @input="autoSaveLesson"
                    @blur="saveLesson"
                    rows="10"
                    placeholder="Детально опиши что нужно сделать..."
                    class="w-full bg-slate-50 border-4 border-transparent focus:border-brand-orange/20 p-8 rounded-[2.5rem] font-bold text-slate-600 leading-relaxed outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div
                v-if="activeTab === 'Тесты'"
                class="animate-in slide-in-from-bottom-2 duration-400 space-y-8"
              >
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Список вопросов ({{ questions.length }})
                  </h3>
                  <button
                    @click="addQuestion"
                    class="px-6 py-2 bg-brand-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-cartoon-green hover:translate-y-[-2px] active:translate-y-0 transition-all"
                  >
                    + Добавить вопрос
                  </button>
                </div>

                <div v-if="questions.length > 0" class="space-y-6">
                  <div
                    v-for="(q, qIdx) in questions"
                    :key="q.id"
                    class="p-6 md:p-8 bg-slate-50 rounded-[2rem] border-4 border-slate-100 space-y-6 relative group/q"
                  >
                    <button
                      @click="deleteQuestion(q.id)"
                      class="absolute top-6 right-6 text-red-300 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>

                    <div class="space-y-3">
                      <div class="flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black"
                          >?</span
                        >
                        <label
                          class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                          >Вопрос №{{ qIdx + 1 }}</label
                        >
                      </div>
                      <input
                        v-model="q.text"
                        @blur="updateQuestion(q)"
                        class="w-full bg-white border-2 border-slate-200 p-4 rounded-xl font-bold text-slate-800 outline-none focus:border-brand-blue"
                        placeholder="..."
                      />
                    </div>

                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          v-for="(_, oIdx) in q.options"
                          :key="oIdx"
                          class="flex items-center gap-3 group/opt"
                        >
                          <button
                            @click="
                              q.correctOption = oIdx;
                              updateQuestion(q);
                            "
                            class="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all shrink-0"
                            :class="
                              q.correctOption === oIdx
                                ? 'bg-brand-green border-brand-green text-white'
                                : 'bg-white border-slate-200 text-transparent hover:border-brand-green'
                            "
                          >
                            ✓
                          </button>
                          <input
                            v-model="q.options[oIdx]"
                            @blur="updateQuestion(q)"
                            class="flex-grow bg-white border-2 border-slate-100 p-3 rounded-lg text-xs font-bold text-slate-600 outline-none focus:border-brand-blue"
                          />
                          <button
                            @click="removeOption(q, oIdx)"
                            class="opacity-0 group-hover/opt:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <button
                        @click="addOption(q)"
                        class="text-[9px] font-black text-brand-blue uppercase tracking-widest hover:underline"
                      >
                        + Добавить вариант ответа
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-50"
                >
                  <span class="text-5xl">🔭</span>
                  <div class="space-y-1">
                    <p class="font-black text-slate-800 uppercase tracking-widest text-sm">
                      Здесь пока пусто
                    </p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Нажмите "Добавить вопрос", чтобы начать квиз
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <!-- Generic File Input -->
      <input type="file" ref="genericFileInput" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- IDLE STATE -->
    <template v-if="!selectedLesson">
      <div
        class="fixed inset-0 lg:ml-[300px] mt-16 md:mt-20 flex flex-col items-center justify-center p-12 text-center space-y-10 animate-in zoom-in duration-500 bg-slate-50 z-10"
      >
        <div class="relative">
          <div class="text-[8rem] md:text-[12rem] animate-float relative z-10">🏗️</div>
          <div
            class="absolute inset-0 bg-brand-blue/10 blur-[60px] rounded-full scale-150 animate-pulse"
          ></div>
        </div>
        <div class="space-y-4 relative z-10">
          <h2
            class="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-none italic"
          >
            Выбери чертеж
          </h2>
          <p
            class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.4em] max-w-sm mx-auto"
          >
            Выберите урок из списка слева, чтобы начать проектирование контента
          </p>
        </div>
        <button
          @click="isSidebarOpen = true"
          class="lg:hidden px-10 py-5 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-cartoon-blue hover:translate-y-[-4px] active:translate-y-0 transition-all"
        >
          Открыть программу
        </button>
      </div>
    </template>

    <!-- QUALITY GUARD HUD (Floating desktop) -->
    <div v-if="selectedLesson" class="fixed bottom-10 right-10 hidden 2xl:block z-[200]">
      <div
        class="bg-white p-6 rounded-[2.5rem] border-4 border-slate-100 shadow-2xl space-y-4 w-72"
      >
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-brand-green animate-ping"></div>
          <span class="text-[10px] font-black text-brand-blue uppercase tracking-widest"
            >Аудит Качества</span
          >
        </div>
        <p class="text-[11px] font-bold text-slate-500 leading-snug">
          {{
            selectedLesson.videoUrl
              ? 'Видео добавлено! Убедись, что конспект дополняет его.'
              : 'Для лучшего результата добавьте видео-объяснение.'
          }}
        </p>
        <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
          <div
            class="h-full bg-brand-green transition-all duration-1000"
            :style="{ width: lessonQuality + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useBuilderApi } from '~/features/course-builder/api'
import type { Course, Lesson, Quiz, Question } from '~/shared/types'
import { debounce } from '~/shared/utils/debounce'

const config = useRuntimeConfig()
const route = useRoute()
const builderApi = useBuilderApi()

const course = ref<Course | null>(null)
const selectedLesson = ref<Lesson | null>(null)
const activeTab = ref('Конспект')
const isSaving = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)

const autoSaveLesson = debounce(async () => {
  await saveLesson()
}, 1500)
const fileInput = ref<HTMLInputElement | null>(null)
const genericFileInput = ref<HTMLInputElement | null>(null)
const uploadTarget = ref<'conspectus' | 'homework' | null>(null)
const isSidebarOpen = ref(false)

// Quiz State
const quiz = ref<Quiz | null>(null)
const questions = ref<Question[]>([])

const fetchQuiz = async (lessonId: string) => {
  try {
    const data = await builderApi.getQuiz(lessonId)
    if (data) {
      quiz.value = data
      questions.value = data.questions.map((q: unknown) => {
        const rawQ = q as { options: string | string[] } & Question
        return {
          ...rawQ,
          options: typeof rawQ.options === 'string' ? JSON.parse(rawQ.options) : rawQ.options,
        }
      })
    } else {
      quiz.value = null
      questions.value = []
    }
  } catch (err) {}
}

const createQuiz = async () => {
  if (!selectedLesson.value) return
  try {
    const data = await builderApi.ensureQuiz(selectedLesson.value.id)
    quiz.value = data
    questions.value = []
  } catch (err) {}
}

const addQuestion = async () => {
  if (!quiz.value) await createQuiz()
  if (!quiz.value) return
  try {
    const newQ = {
      text: 'Новый вопрос',
      options: JSON.stringify(['Вариант 1', 'Вариант 2']),
      correctOption: 0,
    }
    const res = await builderApi.addQuestion(quiz.value.id, newQ)
    questions.value.push({
      ...res,
      options: typeof res.options === 'string' ? JSON.parse(res.options) : res.options,
    })
  } catch (err) {}
}

const updateQuestion = async (q: Question) => {
  try {
    await builderApi.updateQuestion(q.id, {
      text: q.text,
      options: JSON.stringify(q.options),
      correctOption: q.correctOption,
    })
  } catch (err) {}
}

const deleteQuestion = async (id: string) => {
  try {
    await builderApi.deleteQuestion(id)
    questions.value = questions.value.filter((q) => q.id !== id)
  } catch (err) {}
}

const addOption = (q: Question) => {
  q.options.push(`Вариант ${q.options.length + 1}`)
  updateQuestion(q)
}

const removeOption = (q: Question, idx: number) => {
  if (q.options.length <= 2) return
  q.options.splice(idx, 1)
  if (q.correctOption >= q.options.length) q.correctOption = 0
  updateQuestion(q)
}

const lessonQuality = computed(() => {
  let q = 0
  if (!selectedLesson.value) return 0
  if (selectedLesson.value.videoUrl) q += 30
  if ((selectedLesson.value.contentRich?.length || 0) > 100) q += 20
  if ((selectedLesson.value.homeworkTask?.length || 0) > 50) q += 20
  if (questions.value.length > 0) q += 30
  return q
})

const previewCourse = () => {
  if (!course.value) return
  window.open(`/courses/${course.value.id}`, '_blank')
}

const togglePublish = async () => {
  if (!course.value) return
  isSaving.value = true
  try {
    const newStatus = !course.value.isPublished
    await builderApi.updateCourse(course.value.id, { isPublished: newStatus })
    course.value.isPublished = newStatus
  } catch (err) {
    alert('Ошибка при обновлении статуса курса')
  } finally {
    isSaving.value = false
  }
}

const getFullUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = config.public.apiBase as string
  return `${base}${url}`
}

const loadStructure = async () => {
  try {
    const data = await builderApi.getStructure(route.params.id as string)
    course.value = data
  } catch (err) {}
}

onMounted(async () => {
  await loadStructure()
})

const selectLesson = (lesson: Lesson) => {
  selectedLesson.value = { ...lesson }
  fetchQuiz(lesson.id)
}

const triggerUpload = () => fileInput.value?.click()

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) await performUpload(file)
}

const handleDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file?.type.startsWith('video/')) await performUpload(file)
}

const performUpload = async (file: File) => {
  if (!selectedLesson.value) return
  isUploading.value = true
  uploadProgress.value = 10
  try {
    const { url } = await builderApi.uploadVideo(file)
    selectedLesson.value.videoUrl = url
    await saveLesson()
  } catch (err) {
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const triggerFileUpload = (target: 'conspectus' | 'homework') => {
  uploadTarget.value = target
  genericFileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !selectedLesson.value || !uploadTarget.value) return

  isSaving.value = true
  try {
    const { url } = await builderApi.uploadFile(file)
    if (uploadTarget.value === 'conspectus') selectedLesson.value.conspectusFile = url
    else selectedLesson.value.homeworkFile = url
    await saveLesson()
  } catch (err) {
  } finally {
    isSaving.value = false
  }
}

const saveLesson = async () => {
  if (!selectedLesson.value || !course.value) return
  isSaving.value = true
  try {
    await builderApi.updateLesson(selectedLesson.value.id, {
      title: selectedLesson.value.title,
      contentRich: selectedLesson.value.contentRich,
      videoUrl: selectedLesson.value.videoUrl,
      homeworkTitle: selectedLesson.value.homeworkTitle,
      homeworkTask: selectedLesson.value.homeworkTask,
      conspectusFile: selectedLesson.value.conspectusFile,
      homeworkFile: selectedLesson.value.homeworkFile,
    })

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
  } catch (err) {
  } finally {
    setTimeout(() => (isSaving.value = false), 500)
  }
}

const addModule = async () => {
  if (!course.value) return
  const title = prompt('Название модуля:')
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
  const title = prompt('Название урока:')
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
  if (confirm('Удалить модуль?')) {
    await builderApi.deleteModule(id)
    await loadStructure()
  }
}

const deleteLesson = async (id: string) => {
  if (confirm('Удалить урок?')) {
    await builderApi.deleteLesson(id)
    await loadStructure()
    if (selectedLesson.value?.id === id) selectedLesson.value = null
  }
}

definePageMeta({ layout: false, middleware: ['auth'] })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
.shadow-cartoon-sm {
  box-shadow: 0 4px 0 0 #2d3748;
}
.shadow-cartoon-blue {
  box-shadow: 0 8px 0 0 #1e40af;
}
.shadow-cartoon-green {
  box-shadow: 0 8px 0 0 #166534;
}
.shadow-cartoon-orange {
  box-shadow: 0 8px 0 0 #9a3412;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
