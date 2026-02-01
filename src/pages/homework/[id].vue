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
          to="/dashboard"
          class="flex items-center gap-3 font-black text-slate-400 hover:text-brand-blue transition-colors text-xs uppercase tracking-widest"
        >
          <span class="text-lg">⬅️</span> В панель учителя
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
              Выставить оценку
            </h3>

            <div class="space-y-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Статус проверки</label
                >
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="status in ['PENDING', 'CHECKING', 'COMPLETED', 'REJECTED']"
                    :key="status"
                    @click="gradingForm.status = status"
                    class="py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all"
                    :class="
                      gradingForm.status === status
                        ? 'bg-brand-blue border-brand-blue text-white shadow-lg'
                        : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'
                    "
                  >
                    {{
                      status === 'COMPLETED'
                        ? 'ПРИНЯТО ✅'
                        : status === 'REJECTED'
                          ? 'ДОРАБОТКА ❌'
                          : status
                    }}
                  </button>
                </div>
              </div>

              <div class="space-y-3">
                <label
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex justify-between"
                >
                  <span>Оценка (0-100)</span>
                  <span class="text-brand-blue">{{ gradingForm.score }}</span>
                </label>
                <input
                  type="range"
                  v-model="gradingForm.score"
                  min="0"
                  max="100"
                  class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
              </div>

              <div class="space-y-3">
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
                @click="saveGrades"
                :disabled="isSaving"
                class="w-full py-5 bg-brand-green text-white rounded-2xl font-black shadow-[0_8px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {{ isSaving ? 'СОХРАНЯЕМ...' : 'СОХРАНИТЬ РЕЗУЛЬТАТ ✨' }}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useHomeworksApi } from '~/features/homeworks/api'
import HomeworkDiscussion from '~/features/homeworks/ui/HomeworkDiscussion.vue'
import type { Homework } from '~/shared/types'

const route = useRoute()
const homeworksApi = useHomeworksApi()

const homework = ref<Homework | null>(null)
const pending = ref(true)
const isSaving = ref(false)

const gradingForm = ref({
  status: 'PENDING',
  score: 100,
  feedback: '',
})

const loadHomework = async () => {
  try {
    const data = await homeworksApi.getById(route.params.id as string)
    homework.value = data
    gradingForm.value = {
      status: data.status,
      score: data.score || 100,
      feedback: data.feedback || '',
    }
  } catch (err) {
    console.error('Failed to load homework:', err)
  } finally {
    pending.value = false
  }
}

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
    alert('Результат сохранен! 🚀')
    loadHomework()
  } catch (err) {
    alert('Ошибка при сохранении')
  } finally {
    isSaving.value = false
  }
}

onMounted(loadHomework)

definePageMeta({ layout: 'app', middleware: ['auth'] })
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
</style>
