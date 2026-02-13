<template>
  <div class="animate-in slide-in-from-bottom-4 duration-300 space-y-8">
    <div class="grid grid-cols-1 gap-8">
      <!-- Mission Specification -->
      <AppCard padding="none" class="overflow-hidden transition-all">
        <div
          class="bg-slate-50 px-8 py-5 border-b-4 border-white flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-brand-orange/20 rounded-lg flex items-center justify-center text-sm shadow-sm"
            >
              📋
            </div>
            <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest">
              Technical Specification
            </h3>
          </div>
          <div
            class="px-3 py-1 bg-white border-2 border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest"
          >
            v1.0.4
          </div>
        </div>

        <div class="p-8 md:p-10 space-y-6">
          <AppHeading level="h2" size="md">
            {{ currentLesson?.homeworkTitle || 'Практическое задание' }}
          </AppHeading>

          <div class="prose prose-slate max-w-none">
            <p class="text-slate-600 font-bold leading-relaxed whitespace-pre-wrap text-base">
              {{ currentLesson?.homeworkTask }}
            </p>
          </div>

          <div
            v-if="currentLesson?.homeworkFile"
            class="pt-6 border-t-2 border-slate-50 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-lg relative"
              >
                📎
                <div
                  class="absolute -top-1 -right-1 w-3 h-3 bg-brand-orange rounded-full animate-ping"
                ></div>
              </div>
              <div>
                <p
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"
                >
                  Template
                </p>
                <p class="text-xs font-bold text-slate-700 uppercase tracking-tighter">
                  starter_template.py
                </p>
              </div>
            </div>
            <AppButton size="sm" variant="outline" @click="openFile(currentLesson.homeworkFile)">
              Скачать шаблон
            </AppButton>
          </div>
        </div>
      </AppCard>

      <!-- Code Workspace -->
      <div class="space-y-4">
        <div class="flex items-center justify-between px-4">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">
            Development Workspace
          </h4>
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <div class="w-2.5 h-3.5 rounded-full bg-slate-200"></div>
          </div>
        </div>

        <div class="relative group">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-brand-blue/20 to-brand-green/20 rounded-[3rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500"
          ></div>

          <div
            class="relative bg-slate-900 rounded-[2.5rem] border-8 border-white shadow-cartoon overflow-hidden"
          >
            <!-- Window Header -->
            <div
              class="bg-slate-800/50 px-6 py-4 border-b border-white/5 flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <span class="text-[10px] font-mono text-slate-400">main.py</span>
              </div>
              <span class="text-[10px] font-black text-brand-green uppercase tracking-widest">
                Python 3.11
              </span>
            </div>

            <textarea
              v-model="solutionLocal"
              class="w-full h-[500px] p-8 bg-transparent outline-none font-mono text-sm leading-relaxed transition-all resize-none text-brand-green custom-scrollbar-dark placeholder:text-slate-700"
              placeholder="# Вставь свой код здесь...
# Убедись, что решение соответствует техническому заданию выше."
              spellcheck="false"
            ></textarea>

            <!-- Footer Action -->
            <div
              class="bg-slate-800/30 px-6 py-6 border-t border-white/5 flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Система готова</span
                >
              </div>
              <AppButton
                variant="primary"
                :loading="isSubmitting"
                @click="$emit('submit', solutionLocal)"
              >
                DEPLOY SOLUTION 🚀
              </AppButton>
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-4 bg-brand-blue/5 rounded-2xl border-2 border-slate-100 flex items-center gap-4"
      >
        <div
          class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100"
        >
          💡
        </div>
        <p class="text-[11px] font-bold text-slate-500 leading-relaxed italic">
          Твой код будет проверен ИИ-наставником на соответствие чистой архитектуре и PEP8.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import type { Lesson } from '@entities/course/model/types'
import AppButton from '@shared/ui/AppButton.vue'
import AppCard from '@shared/ui/AppCard.vue'
import AppHeading from '@shared/ui/AppHeading.vue'

interface Props {
  currentLesson: Lesson | null
  solution: string
  isSubmitting: boolean
  formatFileUrl: (path?: string) => string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:solution', 'submit'])

const solutionLocal = ref(props.solution)

watch(
  () => props.solution,
  (newVal) => {
    solutionLocal.value = newVal
  },
)

watch(solutionLocal, (newVal) => {
  emit('update:solution', newVal)
})

const openFile = (path?: string) => {
  if (path) window.open(props.formatFileUrl(path), '_blank')
}
</script>

<style scoped>
.custom-scrollbar-dark::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar-dark::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 20px;
}
.custom-scrollbar-dark::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 20px;
  border: 2px solid #0f172a;
}
.custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
