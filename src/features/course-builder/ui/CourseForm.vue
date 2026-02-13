<template>
  <div class="space-y-8">
    <form
      @submit.prevent="handleSubmit"
      class="bg-white p-5 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-6 md:space-y-10"
    >
      <div class="text-center space-y-2 md:space-y-3">
        <div class="text-4xl md:text-6xl animate-float inline-block">✨</div>
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
          Начало пути
        </h2>
        <p class="font-bold text-slate-400 text-xs md:text-base max-w-md mx-auto">
          Дай своему курсу имя и характер. Ты сможешь добавить уроки и видео на следующем шаге.
        </p>
      </div>

      <div class="space-y-8">
        <!-- Main Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div class="space-y-2 md:space-y-3">
            <label
              class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4 md:ml-4"
              >Название приключения</label
            >
            <input
              v-model="form.title"
              type="text"
              placeholder="Напр: Python: От Змейки до ИИ"
              required
              class="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold focus:border-brand-green focus:bg-white outline-none transition-all text-sm md:text-base text-slate-700 placeholder:text-slate-300"
            />
          </div>
          <div class="space-y-2 md:space-y-3">
            <label
              class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4 md:ml-4"
              >Категория</label
            >
            <select
              v-model="form.category"
              class="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold focus:border-brand-blue focus:bg-white outline-none transition-all text-sm md:text-base text-slate-700 appearance-none cursor-pointer"
            >
              <option value="Python">🐍 Python</option>
              <option value="Frontend">✨ Frontend</option>
              <option value="AI">🧠 AI & Data Science</option>
              <option value="GameDev">🎮 Game Design</option>
            </select>
          </div>
        </div>

        <div class="space-y-2 md:space-y-3">
          <label
            class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4 md:ml-4"
            >О чем будет курс?</label
          >
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Кратко опиши цель обучения..."
            required
            class="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold focus:border-brand-yellow focus:bg-white outline-none transition-all text-sm md:text-base text-slate-700 resize-none placeholder:text-slate-300"
          ></textarea>
        </div>

        <!-- Meta info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div class="space-y-2 md:space-y-3">
            <label
              class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4 md:ml-4"
              >Уровень сложности</label
            >
            <div class="flex gap-1 md:gap-2">
              <button
                v-for="lvl in ['Новичок', 'Средний', 'Эксперт']"
                :key="lvl"
                type="button"
                @click="form.level = lvl"
                class="flex-grow py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all border-2"
                :class="
                  form.level === lvl
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                "
              >
                {{ lvl }}
              </button>
            </div>
          </div>
          <div class="space-y-2 md:space-y-3">
            <label
              class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4 md:ml-4"
              >Количество уроков (план)</label
            >
            <input
              v-model.number="form.plannedLessonsCount"
              type="number"
              min="1"
              max="100"
              class="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold focus:border-brand-blue focus:bg-white outline-none transition-all text-sm md:text-base text-slate-700 placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

      <div class="space-y-4 pt-2 md:pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 md:py-6 bg-brand-green text-white rounded-xl md:rounded-[2rem] font-black text-base md:text-xl shadow-[0_6px_0_0_#166534] md:shadow-[0_10px_0_0_#166534] hover:translate-y-1 hover:shadow-[0_4px_0_0_#166534] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3 md:gap-4"
        >
          <span v-if="loading" class="animate-spin text-xl md:text-2xl">⏳</span>
          <span v-else>ПРОДОЛЖИТЬ В КОНСТРУКТОР 🛠️</span>
        </button>

        <p
          class="text-center text-[8px] md:text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]"
        >
          На следующем шаге ты сможешь загрузить видео и создать уроки
        </p>
      </div>

      <!-- Messages -->
      <transition name="fade">
        <div
          v-if="error"
          class="p-5 bg-red-50 border-4 border-red-100 rounded-2xl text-red-500 font-black text-center flex items-center justify-center gap-3"
        >
          <span>🙊</span> {{ error }}
        </div>
      </transition>

      <transition name="fade">
        <div
          v-if="success"
          class="p-5 bg-emerald-50 border-4 border-emerald-100 rounded-2xl text-brand-green font-black text-center animate-bounce flex items-center justify-center gap-3"
        >
          <span>🚀</span> Переходим к архитектору контента...
        </div>
      </transition>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useCourseApi } from '@entities/course/api'
import type { Course } from '@shared/types'
const { createCourse } = useCourseApi()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  title: '',
  description: '',
  category: 'Python',
  level: 'Новичок',
  plannedLessonsCount: 12,
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    const newCourse = (await createCourse(form)) as Course
    success.value = true
    setTimeout(() => {
      router.push(`/courses/builder/${newCourse.id}`)
    }, 1500)
  } catch (err: unknown) {
    const errorData = err as { data?: { message?: string }; message?: string }
    error.value =
      errorData.data?.message || errorData.message || 'Ошибка при создании. Проверь поля!'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 15px 0 0 #f1f5f9;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
