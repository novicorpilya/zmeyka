<template>
  <div
    class="fixed bottom-10 right-10 hidden 2xl:block z-[200] group"
    :class="{ 'pointer-events-none': !isHovered }"
  >
    <!-- Main Card -->
    <div
      class="relative bg-white/80 backdrop-blur-xl p-6 rounded-[3rem] border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-80 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] pointer-events-auto"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Glow Effect -->
      <div
        class="absolute -inset-1 bg-gradient-to-r from-brand-blue/20 to-brand-green/20 rounded-[3rem] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
      ></div>

      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-3 h-3 rounded-full bg-brand-green"></div>
            <div
              class="absolute inset-0 w-3 h-3 rounded-full bg-brand-green animate-ping opacity-50"
            ></div>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
            >Quality Assistant</span
          >
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
          <span class="text-[10px] font-black text-slate-800">{{ qualityScore }}%</span>
        </div>
      </div>

      <!-- Main Tip -->
      <div class="space-y-4">
        <div class="min-h-[40px] flex items-center gap-3">
          <div class="text-2xl animate-bounce-slow">
            {{ currentTip.icon }}
          </div>
          <p class="text-[12px] font-bold text-slate-600 leading-[1.4] transition-all duration-300">
            {{ currentTip.text }}
          </p>
        </div>

        <!-- Progress Track -->
        <div class="space-y-2">
          <div
            class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-300"
          >
            <span>Прогресс урока</span>
            <span>{{ qualityScore }}/100</span>
          </div>
          <div
            class="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden p-0.5 border border-slate-50"
          >
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              :class="qualityColor"
              :style="{ width: qualityScore + '%' }"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"
              ></div>
            </div>
          </div>
        </div>

        <!-- Checkpoints (Visible on hover) -->
        <Transition name="expand">
          <div
            v-show="isHovered"
            class="pt-4 border-t-2 border-slate-50 space-y-2.5 overflow-hidden"
          >
            <div
              v-for="check in checkpoints"
              :key="check.id"
              class="flex items-center gap-3 transition-all duration-300"
              :class="check.complete ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-1'"
            >
              <div
                class="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] shrink-0 transition-colors duration-500"
                :class="
                  check.complete
                    ? 'bg-brand-green text-white rotate-12'
                    : 'bg-slate-100 text-slate-400 font-black'
                "
              >
                {{ check.complete ? '✓' : '○' }}
              </div>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-wider">{{
                check.label
              }}</span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Expand Indicator -->
      <div
        class="mt-4 flex justify-center opacity-40 transition-transform duration-500"
        :class="{ 'rotate-180': isHovered }"
      >
        <span class="text-[10px]">▼</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import type { Lesson, Question } from '@shared/types'

const props = defineProps<{
  lesson: Lesson
  questions: Question[]
}>()

const isHovered = ref(false)

const qualityScore = computed(() => {
  let score = 0
  if (props.lesson.videoUrl) score += 30
  if ((props.lesson.contentRich?.length || 0) > 100) score += 20
  if ((props.lesson.homeworkTask?.length || 0) > 50) score += 20
  if (props.questions.length > 0) score += 30
  return score
})

const qualityColor = computed(() => {
  if (qualityScore.value > 80) return 'bg-brand-green'
  if (qualityScore.value > 50) return 'bg-brand-blue'
  return 'bg-brand-orange'
})

const checkpoints = computed(() => [
  { id: 'video', label: 'Видео-лекция', complete: !!props.lesson.videoUrl },
  {
    id: 'content',
    label: 'Подробный конспект',
    complete: (props.lesson.contentRich?.length || 0) > 100,
  },
  {
    id: 'homework',
    label: 'Практика (ДЗ)',
    complete: (props.lesson.homeworkTask?.length || 0) > 50,
  },
  { id: 'quiz', label: 'Проверочный тест', complete: props.questions.length > 0 },
])

const criticalWarnings = computed(() => {
  const warnings = []
  if (props.questions.length > 0) {
    const hasQuestionsWithoutOptions = props.questions.some(
      (q) => !q.options || q.options.length < 2,
    )
    if (hasQuestionsWithoutOptions) warnings.push('Есть тест без вариантов ответа!')
  }
  if (props.lesson.homeworkTask && !props.lesson.homeworkSolution) {
    warnings.push('Нет решения к ДЗ (ИИ не сможет проверить!)')
  }
  return warnings
})

const currentTip = computed(() => {
  if (criticalWarnings.value.length > 0) {
    return { icon: '🚨', text: criticalWarnings.value[0] }
  }
  // ... existing tips ...
  if ((props.lesson.contentRich?.length || 0) < 100) {
    return { icon: '📖', text: 'Конспект пустоват. Студенты любят, когда под рукой есть текст.' }
  }
  if (props.questions.length === 0) {
    return { icon: '🧐', text: 'Создай хотя бы пару вопросов, чтобы закрепить материал.' }
  }
  if ((props.lesson.homeworkTask?.length || 0) < 50) {
    return { icon: '🛠️', text: 'Задание слишком короткое. Распиши подробнее, что нужно сделать.' }
  }
  return { icon: '✨', text: 'Урок выглядит отлично! Можешь публиковать.' }
})
</script>

<style scoped>
.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 200px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
