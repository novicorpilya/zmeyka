<template>
  <div class="h-full flex flex-col">
    <!-- Sidebar Header -->
    <div class="p-6 md:p-8 border-b-4 border-slate-100 flex items-center justify-between shrink-0">
      <button
        @click="$emit('deselect')"
        class="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-brand-blue transition-colors flex items-center gap-2 group"
      >
        <span class="group-hover:scale-125 transition-transform">⚙️</span>
        ПРОГРАММА КУРСА
      </button>
      <button @click="$emit('close')" class="lg:hidden text-slate-400">✕</button>
    </div>

    <!-- Modules List -->
    <div class="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
      <div v-for="(mod, mIdx) in modules" :key="mod.id" class="space-y-4">
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
              @click="$emit('delete-module', mod.id)"
              class="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-xs"
            >
              ×
            </button>
            <button
              @click="$emit('add-lesson', mod.id)"
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
            class="flex items-center gap-2 group/lesson"
          >
            <div
              @click="selectLesson(lesson)"
              class="flex-grow p-3 rounded-xl transition-all cursor-pointer border-2 font-black text-[11px] uppercase tracking-tight"
              :class="
                selectedLessonId === lesson.id
                  ? 'bg-brand-blue/5 border-brand-blue/20 text-brand-blue shadow-sm'
                  : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'
              "
            >
              {{ lesson.title }}
            </div>
            <button
              @click.stop="$emit('toggle-preview', lesson)"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-white border-2 hover:scale-110 shrink-0"
              :class="
                lesson.isPreview
                  ? 'border-brand-green bg-brand-green/5 text-brand-green'
                  : 'border-slate-100 text-slate-200 hover:text-slate-400'
              "
              :title="lesson.isPreview ? 'Убрать из превью' : 'Включить превью для урока'"
            >
              <span class="text-[10px] font-black">{{ lesson.isPreview ? '✅' : '➕' }}</span>
            </button>
          </div>
        </div>
      </div>

      <button
        @click="$emit('add-module')"
        class="w-full py-4 border-4 border-dashed border-slate-100 rounded-2xl font-black text-[10px] text-slate-300 uppercase tracking-widest hover:border-brand-blue/30 hover:text-brand-blue transition-all"
      >
        + Добавить модуль
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Module, Lesson } from '~/shared/types'

defineProps<{
  modules: Module[]
  selectedLessonId: string | undefined
  hasIntro?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-lesson', lesson: Lesson): void
  (e: 'deselect'): void
  (e: 'add-module'): void
  (e: 'delete-module', id: string): void
  (e: 'add-lesson', moduleId: string): void
  (e: 'close'): void
  (e: 'toggle-preview', lesson: Lesson): void
}>()

const selectLesson = (lesson: Lesson) => {
  emit('select-lesson', lesson)
  emit('close')
}
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
</style>
