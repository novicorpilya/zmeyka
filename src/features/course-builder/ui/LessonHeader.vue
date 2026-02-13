<template>
  <div class="space-y-12">
    <!-- Header: Title & Action Meta -->
    <div class="space-y-8">
      <div class="flex items-start justify-between gap-6">
        <div class="space-y-4 flex-grow max-w-4xl">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-yellow/10 text-brand-yellow-800 rounded-lg text-[10px] font-black uppercase tracking-widest border border-brand-yellow/20"
          >
            <span class="animate-pulse">✨</span> Студия контента
          </div>
          <textarea
            :value="lesson.title"
            @input="$emit('update:title', ($event.target as HTMLTextAreaElement).value)"
            @blur="$emit('save')"
            rows="1"
            class="w-full bg-transparent text-4xl md:text-6xl font-black text-slate-900 border-none outline-none focus:text-brand-blue transition-all placeholder:text-slate-100 leading-tight tracking-tighter resize-none"
            placeholder="Заголовок урока..."
          ></textarea>
        </div>

        <div class="flex flex-col items-end gap-3 shrink-0">
          <button
            @click="$emit('delete')"
            class="group flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border-2 border-red-100 hover:border-red-500 font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95"
          >
            Удалить урок ×
          </button>

          <!-- PREVIEW TOGGLE -->
          <button
            @click="$emit('update:isPreview', !lesson.isPreview)"
            class="group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all border-2 font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95"
            :class="
              lesson.isPreview
                ? 'bg-brand-green/10 border-brand-green/30 text-brand-green hover:bg-brand-green hover:text-white'
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
            "
          >
            <span class="text-xs">{{ lesson.isPreview ? '✅' : '👀' }}</span>
            {{ lesson.isPreview ? 'В предпросмотре' : 'Сделать превью' }}
          </button>

          <div
            class="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-200"
          >
            Node: {{ lesson.id.slice(0, 8) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Media Section with Framing -->
    <div class="relative group">
      <!-- Decorative Frame -->
      <div
        class="absolute -inset-4 bg-gradient-to-tr from-slate-200 to-slate-50 rounded-[4rem] -z-10 opacity-50 blur-xl group-hover:opacity-100 transition-opacity"
      ></div>

      <div
        class="aspect-video bg-white rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden transition-all relative"
        :class="[
          isUploading ? 'opacity-50 pointer-events-none' : '',
          !lesson.videoUrl
            ? 'flex flex-col items-center justify-center cursor-pointer border-dashed border-slate-200 hover:border-brand-blue/30'
            : '',
        ]"
        @click="!lesson.videoUrl && triggerUpload()"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <template v-if="lesson.videoUrl">
          <video
            ref="videoRef"
            :src="getFullVideoUrl(lesson.videoUrl)"
            controls
            crossorigin="anonymous"
            class="w-full h-full object-cover"
          ></video>

          <!-- Hover Actions Overlay -->
          <div
            class="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-[10px] font-black text-white uppercase tracking-widest"
                >Preview Mode</span
              >
            </div>
            <div class="flex gap-3">
              <button
                @click.stop="triggerUpload"
                class="px-6 py-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl text-[10px] font-black text-slate-800 uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all border-2 border-slate-100"
              >
                Заменить 🔄
              </button>
              <button
                @click.stop="$emit('delete-video')"
                class="px-5 py-3 bg-red-500/90 backdrop-blur-md rounded-2xl shadow-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-red-600 border-2 border-red-400 transition-all"
              >
                Удалить
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="text-center p-12 space-y-6">
            <div class="relative inline-block">
              <div
                class="text-7xl animate-float relative z-10 transition-transform group-hover:scale-110"
              >
                🎞️
              </div>
              <div
                class="absolute inset-0 bg-brand-blue/10 blur-2xl rounded-full scale-150 animate-pulse"
              ></div>
            </div>
            <div class="space-y-2">
              <h3 class="font-black text-2xl text-slate-800 uppercase tracking-tight italic">
                Мастер-файл
              </h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Drop video here or click to browse
              </p>
            </div>
            <div class="flex items-center gap-2 justify-center py-2">
              <span
                class="px-2 py-1 bg-slate-50 rounded text-[8px] font-black text-slate-400 border border-slate-100 uppercase"
                >MP4</span
              >
              <span
                class="px-2 py-1 bg-slate-50 rounded text-[8px] font-black text-slate-400 border border-slate-100 uppercase"
                >MOV</span
              >
              <span
                class="px-2 py-1 bg-slate-50 rounded text-[8px] font-black text-slate-400 border border-slate-100 uppercase"
                >H.264</span
              >
            </div>
          </div>
        </template>

        <!-- Upload Overlay -->
        <div
          v-if="isUploading"
          class="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-xl z-20"
        >
          <div class="flex flex-col items-center gap-6">
            <div class="relative">
              <div class="w-20 h-20 border-[6px] border-slate-100 rounded-full"></div>
              <div
                class="absolute inset-0 w-20 h-20 border-[6px] border-brand-green border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
            <p class="text-xs font-black text-slate-800 uppercase tracking-[0.5em] animate-pulse">
              Encoding...
            </p>
          </div>
        </div>
      </div>
    </div>

    <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="video/*" />

    <!-- Video Chapters System -->
    <div v-if="lesson.videoUrl" class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs"
          >
            🔖
          </div>
          <div class="space-y-1">
            <h4 class="text-[11px] font-black text-slate-800 uppercase tracking-widest">
              Тайм-коды видео
            </h4>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Помогите студентам ориентироваться в уроке
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="addChapterAtCurrent"
            class="px-4 py-2 bg-brand-blue/10 border-2 border-brand-blue/20 hover:bg-brand-blue hover:text-white rounded-xl text-[10px] font-black text-brand-blue uppercase tracking-widest transition-all"
          >
            ⏱️ На текущем моменте
          </button>
          <button
            @click="addChapter"
            class="px-4 py-2 bg-slate-50 border-2 border-slate-100 hover:border-brand-blue hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 hover:text-brand-blue uppercase tracking-widest transition-all"
          >
            + Новый тайм-код
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(chapter, cIdx) in chapters"
          :key="cIdx"
          class="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border-2 border-transparent hover:border-slate-100 transition-all group"
        >
          <div class="flex items-center gap-2">
            <input
              type="text"
              :value="formatTime(Number(chapter.time))"
              @blur="updateChapterTime(cIdx, ($event.target as HTMLInputElement).value)"
              @keyup.enter="updateChapterTime(cIdx, ($event.target as HTMLInputElement).value)"
              class="w-16 bg-white border-2 border-slate-100 p-2 rounded-lg text-[10px] font-black text-center text-brand-blue outline-none transition-all focus:border-brand-blue"
              placeholder="00:00"
            />
            <button
              @click="captureTime(cIdx)"
              title="Установить текущее время видео"
              class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] hover:bg-brand-blue/10 hover:text-brand-blue transition-all"
            >
              ⏱️
            </button>
          </div>
          <input
            type="text"
            v-model="chapter.title"
            @blur="syncChapters"
            @keyup.enter="syncChapters"
            class="flex-grow bg-transparent border-none outline-none text-xs font-bold text-slate-600 focus:text-slate-900"
            placeholder="Название эпизода..."
          />
          <button
            @click="removeChapter(cIdx)"
            class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import type { Lesson } from '@shared/types'

const props = defineProps<{
  lesson: Lesson
  isUploading: boolean
  apiBase: string
}>()

const emit = defineEmits([
  'update:title',
  'update:chapters',
  'save',
  'delete',
  'upload-video',
  'delete-video',
  'update:isPreview',
])

interface Chapter {
  time: number
  title: string
}

const chapters = computed<Chapter[]>({
  get: () => {
    try {
      return props.lesson.chapters ? JSON.parse(props.lesson.chapters) : []
    } catch {
      return []
    }
  },
  set: (val) => {
    emit('update:chapters', JSON.stringify(val))
    emit('save')
  },
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const parseTime = (timeStr: string) => {
  const parts = timeStr.split(':')
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1])
  }
  return 0
}

const addChapter = () => {
  const newChapters = [...chapters.value, { time: 0, title: '' }]
  newChapters.sort((a, b) => a.time - b.time)
  chapters.value = newChapters
}

const removeChapter = (idx: number) => {
  const newChapters = [...chapters.value]
  newChapters.splice(idx, 1)
  chapters.value = newChapters
}

const updateChapterTime = (idx: number, val: string) => {
  const newChapters = [...chapters.value]
  newChapters[idx].time = parseTime(val)
  newChapters.sort((a, b) => a.time - b.time)
  chapters.value = newChapters
}

const syncChapters = () => {
  chapters.value = [...chapters.value]
}

const fileInput = ref<HTMLInputElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

const triggerUpload = () => fileInput.value?.click()

const captureTime = (idx: number) => {
  if (!videoRef.value) return
  const newChapters = [...chapters.value]
  newChapters[idx].time = Math.floor(videoRef.value.currentTime)
  newChapters.sort((a, b) => a.time - b.time)
  chapters.value = newChapters
}

const addChapterAtCurrent = () => {
  if (!videoRef.value) return
  const newTime = Math.floor(videoRef.value.currentTime)
  const newChapters = [...chapters.value, { time: newTime, title: '' }]
  newChapters.sort((a, b) => a.time - b.time)
  chapters.value = newChapters
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) emit('upload-video', file)
}

const handleDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file?.type.startsWith('video/')) emit('upload-video', file)
}

const getFullVideoUrl = (url: string) => {
  if (url.startsWith('http')) return url
  try {
    const base = new URL(props.apiBase)
    return `${base.origin}${url}`
  } catch (_e) {
    return url
  }
}
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
}
</style>
