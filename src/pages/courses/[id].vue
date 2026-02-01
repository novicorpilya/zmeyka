<template>
  <div class="animate-in fade-in duration-700 bg-slate-50 min-h-screen pb-20">
    <div v-if="pending" class="h-screen flex flex-col items-center justify-center gap-6">
      <div
        class="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="font-black text-slate-400 uppercase tracking-widest text-xs">
        Загружаем мир знаний...
      </p>
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

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <!-- Main Stage -->
        <div class="xl:col-span-8 space-y-8">
          <!-- Cinema Mode Player -->
          <div
            class="bg-slate-900 rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden group aspect-video relative"
          >
            <template v-if="currentLesson?.videoUrl">
              <video
                ref="videoPlayer"
                :key="currentLesson.id"
                :src="getFullUrl(currentLesson.videoUrl)"
                controls
                class="w-full h-full object-cover"
              ></video>
            </template>
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-center p-10"
            >
              <div class="text-6xl mb-6 animate-pulse">📼</div>
              <h3 class="text-2xl font-black text-white uppercase tracking-tight">
                В этом уроке пока нет видео
              </h3>
              <p class="text-slate-400 font-bold max-w-sm mt-2">
                Но не волнуйся! Изучи конспект и приступай к практике ниже.
              </p>
            </div>
          </div>

          <!-- Content Tabs -->
          <div
            class="bg-white rounded-[3rem] border-4 border-slate-100 shadow-cartoon overflow-hidden transition-all"
          >
            <div class="flex border-b-4 border-slate-50">
              <button
                v-for="tab in ['Конспект', 'Практика', 'Обсуждение']"
                :key="tab"
                @click="activeTab = tab"
                class="flex-grow py-6 font-black text-sm uppercase tracking-widest transition-all relative"
                :class="activeTab === tab ? 'text-brand-blue' : 'text-slate-400 hover:bg-slate-50'"
              >
                {{ tab }}
                <div
                  v-if="activeTab === tab"
                  class="absolute bottom-0 left-0 right-0 h-1.5 bg-brand-blue"
                ></div>
              </button>
            </div>

            <div class="p-8 md:p-12 min-h-[400px]">
              <!-- Conspectus View -->
              <div
                v-if="activeTab === 'Конспект'"
                class="space-y-8 animate-in fade-in duration-500"
              >
                <div class="flex items-center justify-between border-b-2 border-slate-50 pb-6">
                  <h2 class="text-3xl font-black text-slate-800 tracking-tight">
                    {{ currentLesson?.title || 'Выбери урок' }}
                  </h2>
                </div>
                <div class="prose prose-slate max-w-none text-slate-600">
                  <div
                    v-if="currentLesson?.contentRich"
                    class="whitespace-pre-wrap font-bold leading-relaxed"
                  >
                    {{ currentLesson.contentRich }}
                  </div>
                  <div v-else class="text-center py-20 opacity-30">
                    <div class="text-5xl mb-4">📖</div>
                    <p class="font-black uppercase tracking-widest">Конспект скоро появится</p>
                  </div>
                </div>
              </div>

              <!-- Practice / Homework Lab -->
              <div
                v-if="activeTab === 'Практика'"
                class="space-y-10 animate-in fade-in duration-500"
              >
                <div v-if="currentLesson?.homeworkTask" class="space-y-8">
                  <div
                    class="p-8 bg-brand-orange/5 border-4 border-brand-orange/10 rounded-[2.5rem] relative overflow-hidden"
                  >
                    <div class="relative z-10 space-y-4">
                      <span
                        class="px-4 py-1.5 bg-brand-orange text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm"
                        >ЗАДАНИЕ</span
                      >
                      <h3 class="text-2xl font-black text-slate-800">
                        {{ currentLesson.homeworkTitle || 'Практическая задача' }}
                      </h3>
                      <p class="font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {{ currentLesson.homeworkTask }}
                      </p>
                    </div>
                    <div
                      class="absolute -right-10 -bottom-10 text-9xl opacity-10 rotate-12 pointer-events-none"
                    >
                      🛠️
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <label class="text-xs font-black text-slate-400 uppercase tracking-widest"
                        >Твое решение (Python)</label
                      >
                    </div>
                    <div class="relative group">
                      <textarea
                        v-model="solution"
                        :disabled="
                          currentHomework?.status === 'PENDING' ||
                          currentHomework?.status === 'CHECKING'
                        "
                        placeholder="def my_solution():\n    # Пиши код здесь..."
                        class="w-full h-80 bg-slate-900 rounded-[2rem] p-8 font-mono text-sm text-brand-green border-4 border-white shadow-cartoon outline-none focus:border-brand-green/30 transition-all resize-none disabled:opacity-50"
                      ></textarea>
                      <button
                        @click="submitSolution"
                        :disabled="
                          isSubmitting ||
                          currentHomework?.status === 'PENDING' ||
                          currentHomework?.status === 'CHECKING'
                        "
                        class="absolute bottom-6 right-6 px-10 py-4 bg-brand-green text-white rounded-2xl font-black shadow-[0_6px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-3 disabled:opacity-50 disabled:shadow-none"
                      >
                        {{
                          isSubmitting
                            ? 'ОТПРАВЛЯЕМ...'
                            : currentHomework?.status === 'PENDING'
                              ? 'НА ПРОВЕРКЕ ⏳'
                              : 'ОТПРАВИТЬ ✨'
                        }}
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-20 opacity-30">
                  <div class="text-5xl mb-4">🏖️</div>
                  <p class="font-black uppercase tracking-widest">
                    В этом уроке практики нет. Отдыхай!
                  </p>
                </div>
              </div>
              <!-- Discussion Tab -->
              <div
                v-if="activeTab === 'Обсуждение'"
                class="animate-in fade-in duration-500 min-h-[400px]"
              >
                <HomeworkDiscussion
                  v-if="currentHomework"
                  :homework="currentHomework"
                  @refresh="fetchHomeworkStatus"
                />
                <div v-else class="text-center py-20 opacity-30">
                  <div class="text-5xl mb-4">💬</div>
                  <p class="font-black uppercase tracking-widest">
                    Отправьте решение, чтобы открыть обсуждение с учителем
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="xl:col-span-4 space-y-8 sticky top-8">
          <div
            class="bg-brand-blue p-8 rounded-[3rem] shadow-[0_12px_0_0_#1e40af] text-white space-y-6 relative overflow-hidden group"
          >
            <div class="relative z-10">
              <h3 class="text-xl font-black uppercase tracking-tight mb-2">Общий прогресс</h3>
              <div class="flex items-end gap-2 mb-4">
                <span class="text-5xl font-black leading-none">{{ xp }}</span>
                <span class="text-xl font-bold opacity-60">XP</span>
              </div>
              <div class="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  class="h-full bg-white rounded-full transition-all duration-1000"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>
            <div
              class="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[2s]"
            ></div>
          </div>

          <div
            class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-6"
          >
            <h3
              class="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3"
            >
              🗺️ План курса
            </h3>
            <div class="space-y-8 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              <div v-for="(mod, mIdx) in course.modules" :key="mod.id" class="space-y-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs"
                  >
                    {{ Number(mIdx) + 1 }}
                  </div>
                  <span class="font-black text-xs text-slate-800 uppercase tracking-widest">{{
                    mod.title
                  }}</span>
                </div>
                <div class="ml-4 pl-4 border-l-4 border-slate-50 space-y-3">
                  <div
                    v-for="lesson in mod.lessons"
                    :key="lesson.id"
                    @click="selectLesson(lesson)"
                    class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group"
                    :class="
                      currentLesson?.id === lesson.id
                        ? 'bg-brand-blue/5 border-brand-blue/20'
                        : 'bg-slate-50 border-transparent hover:border-slate-200'
                    "
                  >
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg">
                      {{ lesson.videoUrl ? '📺' : '📖' }}
                    </div>
                    <div class="flex-grow min-w-0">
                      <p
                        class="text-xs font-black truncate"
                        :class="
                          currentLesson?.id === lesson.id ? 'text-brand-blue' : 'text-slate-500'
                        "
                      >
                        {{ lesson.title }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

import { useCourseApi } from '~/entities/course/api'
import { useHomeworksApi } from '~/features/homeworks/api'
import HomeworkDiscussion from '~/features/homeworks/ui/HomeworkDiscussion.vue'
import type { Course, Lesson, Homework } from '~/shared/types'

const config = useRuntimeConfig()
const route = useRoute()
const { getCourse } = useCourseApi()
const homeworksApi = useHomeworksApi()

const course = ref<Course | null>(null)
const currentLesson = ref<Lesson | null>(null)
const pending = ref(true)
const activeTab = ref('Конспект')
const solution = ref('')
const currentHomework = ref<Homework | null>(null)
const isSubmitting = ref(false)
const progress = computed(() => course.value?.calculatedProgress || 0)
const xp = computed(() => course.value?.calculatedXp || 0)

onMounted(async () => {
  try {
    const data = (await getCourse(route.params.id as string)) as Course
    course.value = data
    if (data.modules?.[0]?.lessons?.[0]) {
      currentLesson.value = data.modules[0].lessons[0]
    }
  } catch (err) {
    console.error('Failed to load course:', err)
  } finally {
    pending.value = false
  }
})

const selectLesson = async (lesson: Lesson) => {
  currentLesson.value = lesson
  solution.value = ''
  await fetchHomeworkStatus()
}

const fetchHomeworkStatus = async () => {
  if (!currentLesson.value) return
  try {
    currentHomework.value = await homeworksApi.getStatus(currentLesson.value.id)
  } catch (err) {
    currentHomework.value = null
  }
}

const submitSolution = async () => {
  if (!currentLesson.value || !course.value || !solution.value) return
  isSubmitting.value = true
  try {
    await homeworksApi.submit(currentLesson.value.id, course.value.id, solution.value)
    await fetchHomeworkStatus()
    alert('Решение отправлено на проверку! 🚀')
  } catch (err) {
    alert('Ошибка при отправке решения')
  } finally {
    isSubmitting.value = false
  }
}

watch(currentLesson, () => {
  fetchHomeworkStatus()
})

const getFullUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${config.public.apiBase.replace('/api', '')}${url}`
}

definePageMeta({ layout: 'app', middleware: ['auth'] })
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 20px;
}
</style>
