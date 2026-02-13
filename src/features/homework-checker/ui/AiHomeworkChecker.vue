<template>
  <div
    class="bg-slate-900 rounded-[2rem] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[500px]"
  >
    <!-- Header -->
    <div
      class="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <span class="text-xl">🐍</span>
        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-widest">ИИ-Наставник</h4>
          <p class="text-[9px] text-emerald-500 font-bold uppercase">В сети и готов проверять</p>
        </div>
      </div>
      <div
        v-if="result && !isChecking"
        class="px-3 py-1 bg-emerald-500/10 rounded-lg text-[10px] font-black text-emerald-400"
      >
        SCORE: {{ result.score }}
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow p-6 flex flex-col space-y-4 overflow-y-auto">
      <!-- AI Feedback Bubble -->
      <Transition name="fade">
        <div v-if="isChecking" class="flex justify-start">
          <div
            class="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 animate-pulse text-slate-500 text-sm italic"
          >
            Змейка изучает твой код...
          </div>
        </div>
        <div v-else-if="result" class="flex justify-start">
          <div
            class="bg-emerald-500/5 p-5 rounded-2xl rounded-tl-none border-2 border-emerald-500/20 space-y-3 max-w-[90%]"
          >
            <p class="text-emerald-50 text-sm leading-relaxed">{{ result.feedback }}</p>
            <div
              v-if="result.fix"
              class="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-emerald-400"
            >
              <div class="text-[8px] text-slate-500 mb-1 uppercase uppercase tracking-widest">
                Совет по исправлению:
              </div>
              {{ result.fix }}
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center flex-grow opacity-20 pointer-events-none py-12"
        >
          <span class="text-6xl mb-4">💤</span>
          <p class="text-[10px] font-black text-white uppercase tracking-[0.3em]">
            Ожидание кода для проверки
          </p>
        </div>
      </Transition>
    </div>

    <!-- Action Area -->
    <div class="p-6 bg-slate-800/30 border-t border-slate-800">
      <button
        @click="checkHomework"
        :disabled="isChecking || !code"
        class="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-900 font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
      >
        <span v-if="isChecking" class="animate-spin text-xl">⏳</span>
        <span v-else>ОТПРАВИТЬ НА ПРОВЕРКУ</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useGeminiService, type ReviewResult } from '@shared/api/gemini.service'

const props = defineProps<{
  code: string
  taskDescription: string
}>()

const isChecking = ref(false)
const result = ref<ReviewResult | null>(null)

const checkHomework = async () => {
  if (isChecking.value || !props.code) return
  isChecking.value = true
  result.value = null

  try {
    const { reviewCode } = useGeminiService()
    result.value = await reviewCode(props.code, props.taskDescription)
  } catch {
    // Silent fail
  } finally {
    isChecking.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
