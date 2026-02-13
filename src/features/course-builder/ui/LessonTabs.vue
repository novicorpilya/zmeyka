<template>
  <div
    class="bg-white rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden transition-all flex flex-col min-h-[700px] relative"
  >
    <!-- Premium Tab Bar -->
    <div
      class="px-8 pt-8 pb-4 flex items-center justify-between border-b-4 border-slate-50 bg-slate-50/20"
    >
      <div class="flex p-2 bg-slate-100/50 rounded-2xl gap-1">
        <button
          v-for="tab in ['Материалы', 'Домашнее Задание', 'Тесты']"
          :key="tab"
          @click="activeTab = tab"
          class="px-6 py-3 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl border-2"
          :class="
            activeTab === tab
              ? 'bg-white border-white text-brand-blue shadow-sm scale-105'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          "
        >
          {{ tab }}
        </button>
      </div>

      <div class="flex items-center gap-4 pr-4">
        <div class="flex -space-x-2">
          <div
            v-for="i in 3"
            :key="i"
            class="w-8 h-8 rounded-full border-2 border-white bg-slate-100"
          ></div>
        </div>
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest"
          >Collaborative Mode</span
        >
      </div>
    </div>

    <!-- Editor Surface -->
    <div class="flex-grow p-8 md:p-14 overflow-y-auto no-scrollbar">
      <!-- MATERIALS TAB -->
      <div
        v-if="activeTab === 'Материалы'"
        class="animate-in slide-in-from-bottom-4 duration-500 h-full flex flex-col gap-10"
      >
        <!-- Specialized Attachment Block -->
        <div
          class="group flex items-center justify-between p-6 rounded-[2rem] border-4 border-slate-50 transition-all hover:bg-slate-50/50"
          :class="{ 'border-brand-green/20 bg-brand-green/5': lesson.conspectusFile }"
        >
          <div class="flex items-center gap-6">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 transition-all"
              :class="
                lesson.conspectusFile
                  ? 'bg-brand-green text-white border-brand-green'
                  : 'bg-white text-slate-300 border-slate-100'
              "
            >
              {{ lesson.conspectusFile ? '📄' : '📎' }}
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >Вспомогательные материалы</span
              >
              <span class="text-sm font-black text-slate-800 tracking-tight">{{
                lesson.conspectusFile ? 'Документ успешно загружен' : 'Прикрепите PDF или методичку'
              }}</span>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              v-if="lesson.conspectusFile"
              @click="removeConspectus"
              class="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              Удалить
            </button>
            <button
              @click="$emit('trigger-upload', 'conspectus')"
              class="px-6 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all shadow-sm active:scale-95"
            >
              {{ lesson.conspectusFile ? 'Заменить' : 'Загрузить файл' }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center gap-2 px-2">
            <div
              class="w-4 h-4 rounded bg-brand-blue/10 flex items-center justify-center text-[8px]"
            >
              M↓
            </div>
            <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]"
              >Markdown Editor</span
            >
          </div>
          <textarea
            ref="materialsTextarea"
            :value="lesson.contentRich"
            @input="handleInput('contentRich', $event, materialsTextarea)"
            @blur="$emit('save')"
            class="w-full bg-transparent border-none outline-none font-bold text-lg md:text-2xl text-slate-600 leading-relaxed placeholder:text-slate-100 resize-none min-h-[400px]"
            placeholder="Опиши теорию этого урока..."
          ></textarea>
        </div>
      </div>

      <!-- HOMEWORK TAB -->
      <div
        v-if="activeTab === 'Домашнее Задание'"
        class="space-y-12 animate-in slide-in-from-bottom-4 duration-500"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 bg-brand-orange rounded-full"></div>
              <label class="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em]"
                >Цель и Заголовок</label
              >
            </div>
            <button
              @click="$emit('generate-homework-ai')"
              :disabled="isGeneratingHomework"
              class="px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>🤖</span>
              {{ isGeneratingHomework ? 'Магия...' : 'Сгенерировать ИИ' }}
            </button>
          </div>
          <input
            :value="lesson.homeworkTitle"
            @input="$emit('update:homeworkTitle', ($event.target as HTMLInputElement).value)"
            @blur="$emit('save')"
            placeholder="Напр: Реализуй алгоритм поиска..."
            class="w-full bg-slate-50/50 border-4 border-slate-50 focus:border-brand-orange/10 p-8 rounded-[2rem] font-black text-2xl md:text-3xl outline-none transition-all placeholder:text-slate-200"
          />
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between px-2">
            <label class="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em]"
              >Инструкции по кодингу</label
            >
            <button
              @click="$emit('trigger-upload', 'homework')"
              class="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest flex items-center gap-2 border-2 border-transparent"
              :class="
                lesson.homeworkFile
                  ? 'bg-brand-green/5 text-brand-green border-brand-green/20'
                  : 'text-slate-400 hover:text-brand-blue'
              "
            >
              {{ lesson.homeworkFile ? 'Шаблон кода ✓' : 'Прикрепить шаблон (Zip/Py) 📎' }}
            </button>
          </div>
          <textarea
            ref="homeworkTextarea"
            :value="lesson.homeworkTask"
            @input="handleInput('homeworkTask', $event, homeworkTextarea)"
            @blur="$emit('save')"
            rows="10"
            placeholder="Расскажи студенту, что именно он должен запрограммировать..."
            class="w-full bg-white border-4 border-slate-50 focus:border-brand-orange/10 p-10 rounded-[3rem] font-bold text-slate-600 text-lg leading-relaxed outline-none transition-all resize-none min-h-[250px] shadow-sm"
          ></textarea>
        </div>

        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-xl bg-brand-green flex items-center justify-center text-white text-xs"
            >
              🤖
            </div>
            <label class="text-[11px] font-black text-brand-green uppercase tracking-[0.2em]"
              >Эталонное решение (Для ИИ-Проверки)</label
            >
          </div>
          <div class="relative group/editor">
            <div
              class="absolute top-6 right-8 text-[9px] font-black text-brand-green/30 uppercase tracking-[0.3em] group-hover/editor:text-brand-green transition-colors"
            >
              Python Environment
            </div>
            <textarea
              ref="solutionTextarea"
              :value="lesson.homeworkSolution"
              @input="handleInput('homeworkSolution', $event, solutionTextarea)"
              @blur="$emit('save')"
              rows="8"
              placeholder="# Вставь правильный код сюда..."
              class="w-full bg-[#0a0f1e] border-8 border-slate-900 focus:border-brand-green/20 p-10 rounded-[3.5rem] font-mono text-sm text-brand-green leading-relaxed outline-none transition-all resize-none min-h-[300px] shadow-2xl"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- QUIZ TAB -->
      <div
        v-if="activeTab === 'Тесты'"
        class="animate-in slide-in-from-bottom-4 duration-500 space-y-12"
      >
        <slot name="quiz-content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

import type { Lesson } from '@shared/types'

const props = defineProps<{
  lesson: Lesson
  isGeneratingHomework?: boolean
}>()

const emit = defineEmits([
  'update:contentRich',
  'update:homeworkTitle',
  'update:homeworkTask',
  'update:homeworkSolution',
  'update:conspectusFile',
  'save',
  'trigger-upload',
  'generate-homework-ai',
])

const activeTab = ref('Материалы')

const removeConspectus = () => {
  emit('update:conspectusFile', undefined)
  emit('save')
}

const materialsTextarea = ref<HTMLTextAreaElement | null>(null)
const homeworkTextarea = ref<HTMLTextAreaElement | null>(null)
const solutionTextarea = ref<HTMLTextAreaElement | null>(null)

const autoResize = (el: HTMLTextAreaElement | null) => {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

// Watch for tab changes or content changes to resize
watch([activeTab, () => props.lesson.id], () => {
  nextTick(() => {
    autoResize(materialsTextarea.value)
    autoResize(homeworkTextarea.value)
    autoResize(solutionTextarea.value)
  })
})

onMounted(() => {
  nextTick(() => {
    autoResize(materialsTextarea.value)
  })
})

const handleInput = (
  field: 'contentRich' | 'homeworkTask' | 'homeworkSolution',
  event: Event,
  textareaRef: HTMLTextAreaElement | null,
) => {
  const value = (event.target as HTMLTextAreaElement).value
  emit(`update:${field}`, value)
  autoResize(textareaRef)
}
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
