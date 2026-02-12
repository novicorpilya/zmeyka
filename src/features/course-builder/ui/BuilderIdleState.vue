<template>
  <div class="absolute inset-0 flex flex-col bg-[#F8FAFC] z-10 overflow-hidden">
    <div
      class="flex-grow overflow-y-auto custom-scrollbar relative px-6 py-12 lg:p-24 flex flex-col items-center"
    >
      <!-- Layer 1: Animated Mesh Background -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="mesh-gradient absolute inset-0 opacity-40"></div>
        <div class="absolute inset-0 bg-white/40 backdrop-blur-[100px]"></div>
        <!-- Interactive Grid -->
        <div
          class="absolute inset-0 opacity-[0.03]"
          style="
            background-image:
              linear-gradient(#000 1px, transparent 1px),
              linear-gradient(90deg, #000 1px, transparent 1px);
            background-size: 50px 50px;
          "
        ></div>
      </div>

      <!-- Layer 2: Main Composition -->
      <div class="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        <!-- Staggered Entry: Hero Area -->
        <div
          class="flex flex-col items-center text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700"
        >
          <div class="hero-icon-wrapper group">
            <div
              class="hero-icon text-7xl sm:text-9xl relative z-10 drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
            >
              🎨
            </div>
            <div
              class="hero-glow absolute inset-0 bg-brand-blue/20 blur-[80px] rounded-full scale-150 animate-pulse-slow"
            ></div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-center gap-2 mb-4">
              <span
                class="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-blue/20"
              >
                Draft Mode
              </span>
              <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                v1.0.4
              </span>
            </div>
            <h1
              class="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] uppercase italic text-center"
            >
              Ваша
              <span
                class="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-green"
                >Студия</span
              >
            </h1>
            <p
              class="text-sm sm:text-lg font-medium text-slate-500 max-w-xl mx-auto leading-relaxed"
            >
              Здесь рождаются лучшие курсы. Начните с настройки фундамента или выберите первый урок
              в меню слева.
            </p>
          </div>
        </div>

        <!-- Staggered Entry: Action Grid (Bento Style) -->
        <div
          v-if="course"
          class="w-full grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000"
        >
          <!-- Main Settings Card -->
          <div
            class="md:col-span-8 bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white shadow-card-premium p-8 sm:p-12 space-y-10"
          >
            <div class="flex items-center justify-between">
              <h2
                class="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3"
              >
                <span
                  class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg"
                  >📝</span
                >
                Манифест Проекта
              </h2>
            </div>

            <div class="grid grid-cols-1 gap-8">
              <div class="form-group">
                <label
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1 text-left"
                  >Заголовок Приключения</label
                >
                <input
                  v-model="course.title"
                  type="text"
                  @change="$emit('update-course-settings')"
                  class="studio-input"
                  placeholder="Напр: Мастерство Python..."
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="form-group">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1 text-left"
                    >План Модулей</label
                  >
                  <div class="input-with-icon">
                    <div class="icon">📚</div>
                    <input
                      v-model.number="course.plannedLessonsCount"
                      type="number"
                      @change="$emit('update-course-settings')"
                      class="studio-input-clean"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1 text-left"
                    >Тип Сложности</label
                  >
                  <div class="input-with-icon">
                    <div class="icon">📈</div>
                    <select
                      v-model="course.level"
                      @change="$emit('update-course-settings')"
                      class="studio-input-clean appearance-none cursor-pointer"
                    >
                      <option>Новичок</option>
                      <option>Средний</option>
                      <option>Эксперт</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1 text-left"
                    >Стоимость занятий (₽)</label
                  >
                  <div class="input-with-icon">
                    <div class="icon">💎</div>
                    <input
                      v-model.number="course.price"
                      type="number"
                      @change="$emit('update-course-settings')"
                      class="studio-input-clean"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1 text-left"
                    >Менторинг (₽)</label
                  >
                  <div class="input-with-icon">
                    <div class="icon">🤝</div>
                    <input
                      v-model.number="course.mentoringPrice"
                      type="number"
                      @change="$emit('update-course-settings')"
                      class="studio-input-clean"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div class="form-group sm:col-span-2">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1 text-left"
                    >Приветственное видео курса</label
                  >

                  <!-- Premium Video Upload Area -->
                  <div
                    @click="introVideoInputRef?.click()"
                    class="relative aspect-video rounded-3xl border-4 border-dashed bg-white overflow-hidden transition-all group flex flex-col items-center justify-center cursor-pointer"
                    :class="
                      course.introVideoUrl
                        ? 'border-brand-green/30'
                        : 'border-slate-100 hover:border-brand-blue/30'
                    "
                  >
                    <video
                      v-if="course.introVideoUrl"
                      :src="getFullVideoUrl(course.introVideoUrl)"
                      class="absolute inset-0 w-full h-full object-cover"
                      @click.stop
                      controls
                    ></video>

                    <div
                      v-if="!course.introVideoUrl"
                      class="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform"
                    >
                      <span class="text-4xl text-slate-200">🎬</span>
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                        >Загрузить видеовизитку</span
                      >
                    </div>

                    <!-- Hover Overlay -->
                    <div
                      v-if="course.introVideoUrl"
                      class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                    >
                      <span class="text-white text-[10px] font-black uppercase tracking-widest"
                        >Сменить видео 🔄</span
                      >
                    </div>

                    <!-- Uploading Overlay -->
                    <div
                      v-if="isUploading"
                      class="absolute inset-0 bg-white/90 backdrop-blur-xl flex items-center justify-center z-20"
                    >
                      <div
                        class="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"
                      ></div>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center gap-3">
                    <div class="icon text-sm">🔗</div>
                    <input
                      v-model="course.introVideoUrl"
                      type="text"
                      @change="$emit('update-course-settings')"
                      class="flex-grow bg-white border-2 border-slate-100 p-3 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-brand-blue transition-all"
                      placeholder="Или вставьте ссылку (YouTube/Vimeo)..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Stats -->
          <div class="md:col-span-4 space-y-6">
            <!-- Stat Card: Students -->
            <div
              class="bg-brand-blue p-8 rounded-[2.5rem] text-white shadow-cartoon-blue flex flex-col justify-between h-48 group overflow-hidden relative"
            >
              <div class="relative z-10">
                <span class="text-[10px] font-black uppercase tracking-widest opacity-60"
                  >Студентов сейчас</span
                >
                <div class="text-5xl font-black mt-2 tracking-tighter">
                  {{ course?.studentsCount || 0 }}
                </div>
              </div>
              <div
                class="text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10 flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> Live Update
              </div>
              <div
                class="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:scale-125 transition-transform duration-700"
              >
                👥
              </div>
            </div>

            <!-- Stat Card: Health -->
            <div
              class="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-card-premium flex flex-col justify-between h-48 group overflow-hidden"
            >
              <div class="text-left">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Прогресс сборки</span
                >
                <div class="flex items-end gap-2 mt-2">
                  <div class="text-4xl font-black text-slate-800 tracking-tighter">84%</div>
                  <div class="text-xs font-black text-brand-green mb-1.5 uppercase">Отлично</div>
                </div>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-brand-green w-[84%] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div
          class="mt-16 flex flex-wrap justify-center gap-8 opacity-40 animate-in fade-in duration-1000 transition-delay-500"
        >
          <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span class="text-lg">☁️</span> Cloud Identity Verified
          </div>
          <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span class="text-lg">🛡️</span> AES-256 Encrypted
          </div>
        </div>

        <!-- Mobile Navigation Stimulator -->
        <button
          @click="$emit('open-sidebar')"
          class="lg:hidden mt-8 mb-12 w-full max-w-xs py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-blue transition-all active:scale-95 flex items-center justify-center gap-4 group"
        >
          <span class="group-hover:translate-x-1 transition-transform font-black"
            >🗂️ Открыть программу</span
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '~/shared/types'

defineProps<{
  course: Course | null
  isUploading: boolean
  getFullVideoUrl: (url: string) => string
  introVideoInputRef: HTMLInputElement | null
}>()

defineEmits<{
  'update-course-settings': []
  'open-sidebar': []
  'intro-video-upload': [event: Event]
}>()
</script>

<style scoped>
@reference "tailwindcss";

.studio-input {
  @apply w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-2xl font-bold outline-none transition-all text-slate-700 shadow-inner;
}
.studio-input:focus {
  border-color: var(--color-brand-blue);
  background-color: white;
}
.studio-input-clean {
  @apply bg-transparent border-none outline-none font-black text-slate-700 w-full py-2;
}
.input-with-icon {
  @apply flex items-center gap-4 bg-slate-100/50 p-1.5 rounded-2xl border-2 border-transparent transition-all;
}
.input-with-icon:focus-within {
  border-color: var(--color-brand-blue);
  background-color: white;
}
.input-with-icon .icon {
  @apply w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg;
}

.hero-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transition-delay-500 {
  transition-delay: 500ms;
}
</style>
