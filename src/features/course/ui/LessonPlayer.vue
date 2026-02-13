<template>
  <div
    class="bg-slate-900 rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden group aspect-video relative flex flex-col"
    @mouseenter="showControls = true"
    @mouseleave="showControls = false"
  >
    <!-- Main Display Area -->
    <div v-if="videoUrl" class="relative flex-grow h-full overflow-hidden flex">
      <!-- The Video -->
      <video
        ref="videoPlayer"
        :src="fullUrl"
        crossorigin="anonymous"
        class="w-full h-full object-cover cursor-pointer"
        @click="togglePlay"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @ended="isPlaying = false"
      ></video>

      <!-- Center Play/Pause Overlay (Animated) -->
      <div
        v-if="!isPlaying"
        class="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] pointer-events-none transition-all duration-500"
      >
        <div
          class="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-white/30 animate-pulse"
        >
          <div class="text-4xl translate-x-1">▶️</div>
        </div>
      </div>

      <!-- Chapters Sidebar (Premium Slide-out) -->
      <aside
        v-if="parsedChapters.length > 0"
        class="absolute inset-y-0 right-0 w-72 bg-slate-950/80 backdrop-blur-2xl border-l border-white/5 transition-transform duration-700 z-30 flex flex-col"
        :class="showChapters ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="p-8 border-b border-white/5 flex items-center justify-between">
          <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Навигация
          </h4>
          <button
            @click="showChapters = false"
            class="text-white opacity-40 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
        <div class="flex-grow overflow-y-auto custom-scrollbar-dark p-4 space-y-2">
          <button
            v-for="(chapter, idx) in sortedChapters"
            :key="idx"
            @click="seekTo(chapter.time)"
            class="w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group/item"
            :class="
              isCurrentChapter(idx)
                ? 'bg-brand-blue/20 border-brand-blue/30'
                : 'border-transparent hover:bg-white/5'
            "
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 transition-colors"
              :class="
                isCurrentChapter(idx) ? 'bg-brand-blue text-white' : 'bg-slate-800 text-slate-500'
              "
            >
              {{ formatTime(chapter.time) }}
            </div>
            <div class="min-w-0">
              <p
                class="text-xs font-black truncate transition-colors"
                :class="
                  isCurrentChapter(idx)
                    ? 'text-white'
                    : 'text-slate-400 group-hover/item:text-slate-200'
                "
              >
                {{ chapter.title || `Фрагмент ${idx + 1}` }}
              </p>
              <p
                v-if="isCurrentChapter(idx)"
                class="text-[8px] font-black text-brand-blue uppercase tracking-widest mt-0.5"
              >
                Сейчас играет
              </p>
            </div>
          </button>
        </div>
      </aside>

      <!-- Floating Controls UI -->
      <div
        class="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 z-20"
        :class="
          showControls || !isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        "
      >
        <!-- Progress Bar -->
        <div
          class="group/progress relative h-6 flex items-center mb-6 cursor-pointer"
          @mousedown="startScrub"
        >
          <div class="h-1.5 w-full bg-white/20 rounded-full overflow-hidden relative">
            <div
              class="h-full bg-brand-blue rounded-full relative"
              :style="{ width: progressPercent + '%' }"
            >
              <div
                class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl scale-0 group-hover/progress:scale-100 transition-transform"
              ></div>
            </div>
          </div>
          <!-- Chapter Marks on Timeline -->
          <div
            v-for="(chapter, idx) in sortedChapters"
            :key="'mark-' + idx"
            class="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-white/40 rounded-full hover:bg-white hover:h-4 hover:w-1.5 transition-all z-10"
            :style="{ left: (chapter.time / duration) * 100 + '%' }"
            :title="chapter.title"
          ></div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-8">
            <!-- Play/Pause -->
            <button
              @click="togglePlay"
              class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <span class="text-xl">{{ isPlaying ? '⏸️' : '▶️' }}</span>
            </button>

            <!-- Time Display -->
            <div class="flex items-center gap-3 font-mono text-[11px] font-black tracking-widest">
              <span class="text-white">{{ formatTime(currentTime) }}</span>
              <span class="text-white/20">/</span>
              <span class="text-white/40">{{ formatTime(duration) }}</span>
            </div>

            <!-- Volume -->
            <div class="flex items-center gap-4 group/vol">
              <button
                @click="toggleMute"
                class="text-lg opacity-60 hover:opacity-100 transition-opacity"
              >
                {{ isMuted || volume === 0 ? '🔇' : '🔊' }}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                v-model="volume"
                class="w-0 group-hover/vol:w-20 transition-all duration-500 accent-brand-blue"
              />
            </div>
          </div>

          <div class="flex items-center gap-6">
            <!-- Speed Control -->
            <select
              v-model="playbackRate"
              class="bg-white/10 text-white border-2 border-white/5 rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest outline-none hover:bg-white/20 transition-all"
            >
              <option value="0.5" class="bg-slate-900 text-white">0.5x</option>
              <option value="1" class="bg-slate-900 text-white">1.0x</option>
              <option value="1.5" class="bg-slate-900 text-white">1.5x</option>
              <option value="2" class="bg-slate-900 text-white">2.0x</option>
            </select>

            <!-- Chapters Toggle -->
            <button
              v-if="parsedChapters.length > 0"
              @click="showChapters = !showChapters"
              class="px-5 py-2.5 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all"
              :class="
                showChapters
                  ? 'bg-brand-blue border-brand-blue text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              "
            >
              📖 {{ showChapters ? 'Закрыть программу' : 'Программа урока' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error/No Video State -->
    <div
      v-if="!videoUrl"
      class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-center p-10"
    >
      <div class="text-6xl mb-6 animate-pulse">📼</div>
      <h3 class="text-2xl font-black text-white uppercase tracking-tight">
        В этом уроке пока нет видео
      </h3>
      <p class="text-slate-400 font-bold max-w-sm mt-2">
        Но не волнуйся! Изучи конспект и приступай к практике ниже.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'

const props = defineProps<{
  videoUrl?: string | null
  chapters?: string | null
}>()

const config = useRuntimeConfig()
const videoPlayer = ref<HTMLVideoElement | null>(null)

// UI State
const isPlaying = ref(false)
const showControls = ref(true)
const showChapters = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const playbackRate = ref(1)

const fullUrl = computed(() => {
  if (!props.videoUrl) return ''
  if (props.videoUrl.startsWith('http')) return props.videoUrl
  try {
    const url = new URL(config.public.apiBase)
    return `${url.origin}${props.videoUrl}`
  } catch (_e) {
    return props.videoUrl
  }
})

const parsedChapters = computed(() => {
  if (!props.chapters) return []
  try {
    const data = typeof props.chapters === 'string' ? JSON.parse(props.chapters) : props.chapters
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
})

const sortedChapters = computed(() => {
  return [...parsedChapters.value].sort((a, b) => a.time - b.time)
})

const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const isCurrentChapter = (idx: number) => {
  const current = sortedChapters.value[idx]
  const next = sortedChapters.value[idx + 1]
  if (!next) return currentTime.value >= current.time
  return currentTime.value >= current.time && currentTime.value < next.time
}

// Logic
const togglePlay = () => {
  if (!videoPlayer.value) return
  if (isPlaying.value) {
    videoPlayer.value.pause()
  } else {
    videoPlayer.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const toggleMute = () => {
  if (!videoPlayer.value) return
  isMuted.value = !isMuted.value
  videoPlayer.value.muted = isMuted.value
}

const onTimeUpdate = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (videoPlayer.value) {
    duration.value = videoPlayer.value.duration
  }
}

const seekTo = (time: number) => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = time
    if (!isPlaying.value) togglePlay()
  }
}

const startScrub = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const update = (moveEvent: MouseEvent) => {
    const rect = target.getBoundingClientRect()
    const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width))
    const percent = x / rect.width
    if (videoPlayer.value) {
      videoPlayer.value.currentTime = percent * duration.value
    }
  }
  update(e)
  document.addEventListener('mousemove', update)
  document.addEventListener(
    'mouseup',
    () => {
      document.removeEventListener('mousemove', update)
    },
    { once: true },
  )
}

watch(playbackRate, (newVal) => {
  if (videoPlayer.value) {
    videoPlayer.value.playbackRate = Number(newVal)
  }
})

watch(volume, (newVal) => {
  if (videoPlayer.value) {
    videoPlayer.value.volume = Number(newVal)
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {})
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
.custom-scrollbar-dark::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar-dark::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-dark::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
input[type='range'] {
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  height: 4px;
  border-radius: 2px;
}
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}
</style>
