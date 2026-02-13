<template>
  <div class="bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-700">
    <div v-if="pending" class="h-screen flex flex-col items-center justify-center gap-6">
      <div
        class="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="font-black text-slate-400 uppercase tracking-widest text-xs">
        Загружаем работу студента...
      </p>
    </div>

    <div v-else-if="homework" class="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
      <!-- Top Navigation -->
      <nav
        class="flex items-center justify-between bg-white p-4 rounded-3xl border-4 border-slate-100 shadow-sm"
      >
        <NuxtLink
          :to="
            ['TEACHER', 'ADMIN'].includes(userStore.user?.role as string) ? '/dashboard' : '/tasks'
          "
          class="flex items-center gap-3 font-black text-slate-400 hover:text-brand-blue transition-colors text-xs uppercase tracking-widest"
        >
          <span class="text-lg">⬅️</span>
          {{
            ['TEACHER', 'ADMIN'].includes(userStore.user?.role as string)
              ? 'В панель учителя'
              : 'К моим задачам'
          }}
        </NuxtLink>
        <div class="flex items-center gap-4">
          <span
            class="px-4 py-1.5 bg-brand-orange/10 text-brand-orange rounded-full font-black text-[10px] uppercase tracking-widest"
            >Проверка ДЗ</span
          >
        </div>
      </nav>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <!-- Main Content (Task and Chat) -->
        <div class="xl:col-span-8 space-y-8">
          <!-- Task Header -->
          <div
            class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-6"
          >
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="space-y-1">
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">
                  {{ homework.lesson.homeworkTitle || 'Практическое задание' }}
                </h1>
                <p class="text-sm font-bold text-slate-400">Урок: {{ homework.lesson.title }}</p>
              </div>
              <div
                class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100"
              >
                <div
                  class="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center text-xl"
                >
                  👤
                </div>
                <div>
                  <p
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"
                  >
                    Студент:
                  </p>
                  <p class="font-black text-slate-800">{{ homework.student.name }}</p>
                </div>
              </div>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Инструкция задания:
              </p>
              <p class="font-bold text-slate-600 leading-relaxed">
                {{ homework.lesson.homeworkTask }}
              </p>
            </div>
          </div>

          <!-- Student Solution -->
          <div
            class="bg-slate-900 p-8 rounded-[3rem] border-8 border-white shadow-cartoon space-y-4"
          >
            <h3 class="text-xs font-black text-brand-green uppercase tracking-widest pl-2">
              Решение студента:
            </h3>
            <div class="p-6 bg-slate-800/50 rounded-2xl border-2 border-white/5 relative group">
              <pre class="font-mono text-sm text-brand-green leading-relaxed whitespace-pre-wrap">{{
                homework.solutionText || '# Решение отсутствует'
              }}</pre>
              <div
                class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span class="px-3 py-1 bg-white/10 text-white/40 rounded-lg text-[10px] font-bold"
                  >PYTHON</span
                >
              </div>
            </div>
          </div>

          <!-- Discussion/Chat Component -->
          <div class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon">
            <h3
              class="text-xl font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-3"
            >
              💬 Обсуждение
            </h3>
            <HomeworkDiscussion :homework="homework" @refresh="loadHomework" />
          </div>
        </div>

        <!-- Right Column: Grading Tool -->
        <aside class="xl:col-span-4 space-y-8 sticky top-8">
          <div
            class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8"
          >
            <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">
              {{
                ['TEACHER', 'ADMIN'].includes(userStore.user?.role as string)
                  ? 'Выставить оценку'
                  : 'Статус работы'
              }}
            </h3>

            <div class="space-y-6">
              <div
                class="space-y-3"
                v-if="['TEACHER', 'ADMIN'].includes(userStore.user?.role as string)"
              >
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Статус проверки</label
                >
                <div class="grid grid-cols-1 gap-3">
                  <button
                    v-for="status in ['COMPLETED', 'REJECTED', 'NEEDS_REVIEW', 'PENDING']"
                    :key="status"
                    @click="gradingForm.status = status"
                    class="py-4 px-6 rounded-2xl border-4 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-between group"
                    :class="
                      gradingForm.status === status
                        ? 'bg-brand-blue border-brand-blue text-white shadow-lg scale-[1.02]'
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'
                    "
                  >
                    <span>
                      {{
                        status === 'COMPLETED'
                          ? 'Принять ✅'
                          : status === 'REJECTED'
                            ? 'Нужны правки ❌'
                            : status === 'NEEDS_REVIEW'
                              ? 'Ручная проверка 🔍'
                              : 'В очереди / Пропустить ⏳'
                      }}
                    </span>
                    <span
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                      v-if="gradingForm.status !== status"
                    >
                      👉
                    </span>
                  </button>
                </div>
              </div>

              <div
                class="space-y-3"
                v-if="['TEACHER', 'ADMIN'].includes(userStore.user?.role as string)"
              >
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Краткий вердикт</label
                >
                <textarea
                  v-model="gradingForm.feedback"
                  rows="4"
                  placeholder="Напр: Отличная работа! Можешь еще попробовать..."
                  class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-sm outline-none focus:border-brand-blue transition-all resize-none"
                ></textarea>
              </div>

              <button
                v-if="['TEACHER', 'ADMIN'].includes(userStore.user?.role as string)"
                @click="saveGrades"
                :disabled="isSaving"
                class="w-full py-5 bg-brand-green text-white rounded-2xl font-black shadow-[0_8px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {{ isSaving ? 'СОХРАНЯЕМ...' : 'СОХРАНИТЬ РЕЗУЛЬТАТ ✨' }}
              </button>

              <div
                v-if="!['TEACHER', 'ADMIN'].includes(userStore.user?.role as string)"
                class="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-4"
              >
                <div class="flex items-center justify-between">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Статус:
                  </p>
                  <span
                    class="px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest"
                    :class="{
                      'bg-brand-green/10 text-brand-green': homework.status === 'COMPLETED',
                      'bg-rose-50 text-rose-500': homework.status === 'REJECTED',
                      'bg-amber-50 text-amber-500':
                        homework.status === 'PENDING' ||
                        homework.status === 'NEEDS_REVIEW' ||
                        homework.status === 'CHECKING',
                    }"
                  >
                    {{
                      homework.status === 'COMPLETED'
                        ? 'Принято'
                        : homework.status === 'REJECTED'
                          ? 'Нужны правки'
                          : 'На проверке'
                    }}
                  </span>
                </div>
                <div v-if="homework.feedback">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Вердикт учителя:
                  </p>
                  <p class="text-xs font-bold text-slate-600 italic">"{{ homework.feedback }}"</p>
                </div>
                <div class="pt-2 border-t border-slate-200 flex items-center gap-3 text-slate-400">
                  <span class="text-xl">🎓</span>
                  <p class="text-[9px] font-bold">Спроси учителя в чате, если остались вопросы</p>
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
import { ref, watch, onMounted } from 'vue'

import { useHomeworksApi } from '@entities/homework/api'
import { useUserStore } from '@entities/user/model/store'
import HomeworkDiscussion from '@features/homeworks/ui/HomeworkDiscussion.vue'
import { useToast } from '@shared/composables/useToast'
import type { Homework } from '@shared/types'

const route = useRoute()
const userStore = useUserStore()
const homeworksApi = useHomeworksApi()
const toast = useToast()

const {
  data: homework,
  pending,
  refresh: loadHomework,
} = await useAsyncData<Homework>(`homework-detail-${route.params.id}`, () =>
  homeworksApi.getById(route.params.id as string),
)

const isSaving = ref(false)
const gradingForm = ref({
  status: 'PENDING',
  score: 100,
  feedback: '',
})

// Sync form with data (Server & Client compatible)
watch(
  homework,
  (newVal) => {
    if (newVal) {
      gradingForm.value = {
        status: newVal.status,
        score: newVal.score || 100,
        feedback: newVal.feedback || '',
      }
    }
  },
  { immediate: true },
)

const saveGrades = async () => {
  if (!homework.value) return
  isSaving.value = true
  try {
    await homeworksApi.updateStatus(
      homework.value.id,
      gradingForm.value.status,
      Number(gradingForm.value.score),
      gradingForm.value.feedback,
    )
    toast.success('Результат сохранен! 🚀')
    loadHomework()
  } catch (err) {
    toast.error('Ошибка при сохранении')
  } finally {
    isSaving.value = false
  }
}

onMounted(loadHomework)

definePageMeta({ layout: 'main', middleware: ['auth'] })
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
</style>
