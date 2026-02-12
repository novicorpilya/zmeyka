<template>
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

    <TeacherCard :teacher="course?.teacher" />

    <div class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-6">
      <h3
        class="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3"
      >
        🗺️ План курса
      </h3>
      <div class="space-y-8 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        <template v-if="course?.modules">
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
                @click="!lesson.isLocked && $emit('select', lesson)"
                class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group"
                :class="[
                  currentLesson?.id === lesson.id
                    ? 'bg-brand-blue/5 border-brand-blue/20'
                    : 'bg-slate-50 border-transparent hover:border-slate-200',
                  lesson.isLocked ? 'opacity-50 grayscale cursor-not-allowed' : '',
                ]"
              >
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg">
                  {{
                    lesson.isPreview ? '⭐️' : lesson.isLocked ? '🔒' : lesson.videoUrl ? '📺' : '📖'
                  }}
                </div>
                <div class="flex-grow min-w-0">
                  <p
                    class="text-xs font-black truncate"
                    :class="currentLesson?.id === lesson.id ? 'text-brand-blue' : 'text-slate-500'"
                  >
                    {{ lesson.title }}
                  </p>
                  <p
                    v-if="lesson.isPreview && !course?.isEnrolled"
                    class="text-[8px] font-black text-brand-green uppercase tracking-widest mt-0.5"
                  >
                    ПРЕВЬЮ ✨
                  </p>
                </div>
                <div
                  v-if="lesson.progress && lesson.progress[0]?.isCompleted"
                  class="text-brand-green text-xs font-black"
                >
                  ✅
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import TeacherCard from '~/entities/teacher/ui/TeacherCard.vue'
import type { Course, Lesson } from '~/shared/types'

const props = defineProps<{
  course: Course | null
  currentLesson: Lesson | null
}>()

defineEmits<{
  (e: 'select', lesson: Lesson): void
}>()

const progress = computed(() => props.course?.calculatedProgress || 0)
const xp = computed(() => props.course?.calculatedXp || 0)
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
