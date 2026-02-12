<template>
  <div>
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">
        Список вопросов ({{ questions.length }})
      </h3>
      <div class="flex items-center gap-3">
        <button
          @click="$emit('generate-ai')"
          :disabled="isGeneratingAi"
          class="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
        >
          <span class="group-hover:animate-bounce">🧠</span>
          {{ isGeneratingAi ? 'Магия ИИ...' : 'Сгенерировать ИИ' }}
        </button>
        <button
          @click="$emit('add-question')"
          class="px-6 py-2 bg-brand-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-cartoon-green hover:translate-y-[-2px] active:translate-y-0 transition-all"
        >
          + Добавить вопрос
        </button>
      </div>
    </div>

    <div v-if="questions.length > 0" class="space-y-6 mt-6">
      <div
        v-for="(q, qIdx) in questions"
        :key="q.id"
        class="p-6 md:p-8 bg-slate-50 rounded-[2rem] border-4 border-slate-100 space-y-6 relative group/q"
      >
        <button
          @click="$emit('delete-question', q.id)"
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
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >Вопрос №{{ qIdx + 1 }}</label
            >
          </div>
          <input
            :value="q.text"
            @input="updateText(q, ($event.target as HTMLInputElement).value)"
            @blur="$emit('update-question', q)"
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
                @click="setCorrectOption(q, oIdx)"
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
                :value="q.options[oIdx]"
                @input="updateOption(q, oIdx, ($event.target as HTMLInputElement).value)"
                @blur="$emit('update-question', q)"
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
        <p class="font-black text-slate-800 uppercase tracking-widest text-sm">Здесь пока пусто</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Нажмите "Добавить вопрос", чтобы начать квиз
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/shared/types'

defineProps<{
  questions: Question[]
  isGeneratingAi?: boolean
}>()

const emit = defineEmits(['add-question', 'update-question', 'delete-question', 'generate-ai'])

// Helper functions to mutate local state before emitting update
// Note: Props are readonly, but objects inside arrays are mutable in Vue if not frozen.
// Ideally we should emit valid events, but here we modify the object reference for simplicity with v-model
// and then emit 'update-question' to sync with backend.

const updateText = (q: Question, val: string) => {
  q.text = val
}

const updateOption = (q: Question, idx: number, val: string) => {
  q.options[idx] = val
}

const setCorrectOption = (q: Question, idx: number) => {
  q.correctOption = idx
  emit('update-question', q)
}

const addOption = (q: Question) => {
  q.options.push(`Вариант ${q.options.length + 1}`)
  emit('update-question', q)
}

const removeOption = (q: Question, idx: number) => {
  if (q.options.length <= 2) return
  q.options.splice(idx, 1)
  if (q.correctOption >= q.options.length) q.correctOption = 0
  emit('update-question', q)
}
</script>

<style scoped>
.shadow-cartoon-green {
  box-shadow: 0 8px 0 0 #166534;
}
</style>
