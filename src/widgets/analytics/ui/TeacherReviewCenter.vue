<template>
  <div
    class="bg-white p-8 md:p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
        Центр Контроля (AI Hybrid) 🛡️
      </h3>
      <div
        class="px-4 py-2 bg-brand-blue/10 rounded-xl text-brand-blue font-black text-xs uppercase tracking-widest"
      >
        {{ pendingReviews.length }} Ожидают проверки
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin text-4xl">⏳</div>
    </div>

    <div v-else-if="pendingReviews.length === 0" class="text-center py-16 opacity-30">
      <div class="text-6xl mb-4">🥂</div>
      <p class="font-black uppercase tracking-widest text-slate-400">
        Всё проверено! Пора отдыхать.
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="hw in pendingReviews"
        :key="hw.id"
        class="group p-6 bg-slate-50 border-2 border-slate-50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-blue/30 hover:bg-white transition-all cursor-pointer"
        @click="selectedHomework = hw"
      >
        <div class="flex items-center gap-5 w-full md:w-auto">
          <div
            class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm"
          >
            {{ hw.student.avatar || '👤' }}
          </div>
          <div>
            <h4 class="font-black text-slate-800 leading-tight">{{ hw.student.name }}</h4>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Урок: {{ hw.lesson.title }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
          <div class="text-right">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              AI Confidence
            </p>
            <div class="flex items-center gap-2">
              <div class="w-20 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-1000"
                  :class="getConfidenceColor(hw.confidenceScore || 0)"
                  :style="{ width: hw.confidenceScore + '%' }"
                ></div>
              </div>
              <span
                class="font-black text-xs"
                :class="getConfidenceTextColor(hw.confidenceScore || 0)"
              >
                {{ hw.confidenceScore }}%
              </span>
            </div>
          </div>

          <button
            class="bg-white px-6 py-3 rounded-xl font-black text-slate-700 text-xs border-2 border-slate-100 hover:border-brand-blue hover:text-brand-blue transition-all uppercase tracking-widest"
          >
            Проверить
          </button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div
      v-if="selectedHomework"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        class="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div
          class="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/50"
        >
          <div>
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Проверка работы
            </h2>
            <p class="text-slate-500 font-bold text-sm">
              {{ selectedHomework.student.name }} — {{ selectedHomework.lesson.title }}
            </p>
          </div>
          <button
            @click="selectedHomework = null"
            class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        <div class="flex-grow overflow-y-auto p-8 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- AI Reasoning Alert -->
            <div class="p-6 bg-brand-blue/5 border-2 border-brand-blue/20 rounded-3xl space-y-3">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🧠</span>
                <h4 class="font-black text-brand-blue uppercase tracking-widest text-xs">
                  Анализ качества
                </h4>
              </div>
              <p class="text-slate-600 font-bold leading-relaxed italic text-sm">
                "{{ selectedHomework.aiReasoning }}"
              </p>
            </div>

            <!-- AI Integrity Alert -->
            <div class="p-6 bg-orange-50 border-2 border-orange-100 rounded-3xl space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🕵️‍♂️</span>
                  <h4 class="font-black text-orange-600 uppercase tracking-widest text-xs">
                    GPT-Buster (Подлинность)
                  </h4>
                </div>
                <span
                  class="font-black text-xs px-2 py-1 rounded bg-white shadow-sm"
                  :class="getIntegrityTextColor(selectedHomework.integrityScore || 0)"
                >
                  {{ selectedHomework.integrityScore }}%
                </span>
              </div>
              <p class="text-slate-600 font-bold leading-relaxed italic text-sm">
                "{{ selectedHomework.integrityReasoning }}"
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <!-- Student Solution -->
            <div class="space-y-4">
              <h4 class="font-black text-slate-400 uppercase tracking-widest text-xs px-1">
                Решение студента
              </h4>
              <pre
                class="w-full p-6 bg-slate-900 text-slate-100 rounded-3xl font-mono text-xs overflow-x-auto border-4 border-slate-800 shadow-inner"
              ><code>{{ selectedHomework.solutionText }}</code></pre>
            </div>

            <!-- Review Actions -->
            <div class="space-y-6">
              <div class="space-y-2.5">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1"
                  >Оценка ИИ (Черновик)</label
                >
                <input
                  v-model.number="reviewForm.score"
                  type="number"
                  class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-50 rounded-2xl font-black text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div class="space-y-2.5">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1"
                  >Фидбек ИИ (Можно править)</label
                >
                <textarea
                  v-model="reviewForm.feedback"
                  rows="6"
                  class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-600 outline-none focus:border-brand-green focus:bg-white transition-all shadow-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div
          class="p-8 border-t-2 border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-end"
        >
          <button
            @click="submitReview('REJECTED')"
            :disabled="submitting"
            class="px-8 py-4 bg-red-50 text-red-500 rounded-2xl font-black border-2 border-red-100 hover:bg-red-100 transition-all uppercase tracking-widest text-sm"
          >
            Отклонить
          </button>
          <button
            @click="submitReview('COMPLETED')"
            :disabled="submitting"
            class="px-10 py-4 bg-brand-green text-white rounded-2xl font-black shadow-[0_6px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            <span v-if="submitting">Сохранение...</span>
            <span v-else>Решение принято ✨</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'

import { useHomeworksApi } from '@entities/homework/api'
import type { Homework } from '@shared/types'

const homeworksApi = useHomeworksApi()

const pendingReviews = ref<Homework[]>([])
const loading = ref(true)
const submitting = ref(false)
const selectedHomework = ref<Homework | null>(null)

const reviewForm = reactive({
  score: 0,
  feedback: '',
})

watch(selectedHomework, (newHw) => {
  if (newHw) {
    reviewForm.score = newHw.aiScoreDraft || 0
    reviewForm.feedback = newHw.aiFeedbackDraft || ''
  }
})

const getConfidenceColor = (score: number) => {
  if (score > 80) return 'bg-green-500'
  if (score > 50) return 'bg-yellow-400'
  return 'bg-red-500'
}

const getConfidenceTextColor = (score: number) => {
  if (score > 80) return 'text-green-600'
  if (score > 50) return 'text-yellow-600'
  return 'text-red-600'
}

const getIntegrityTextColor = (score: number) => {
  if (score > 70) return 'text-green-600'
  if (score > 40) return 'text-yellow-600'
  return 'text-red-600'
}

const fetchReviews = async () => {
  try {
    loading.value = true
    const data = await homeworksApi.getPending()
    pendingReviews.value = data
  } catch {
    // Silent fail
  } finally {
    loading.value = false
  }
}

const submitReview = async (status: 'COMPLETED' | 'REJECTED') => {
  if (!selectedHomework.value) return

  try {
    submitting.value = true
    await homeworksApi.updateStatus(
      selectedHomework.value.id,
      status,
      reviewForm.score,
      reviewForm.feedback,
    )

    pendingReviews.value = pendingReviews.value.filter((h) => h.id !== selectedHomework.value?.id)
    selectedHomework.value = null
  } catch {
    // Silent fail or show toast
  } finally {
    submitting.value = false
  }
}

onMounted(fetchReviews)
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
</style>
