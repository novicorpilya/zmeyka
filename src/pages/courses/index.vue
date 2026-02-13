<template>
  <div class="space-y-6 md:space-y-10 animate-in fade-in duration-500">
    <!-- Header with Action -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          {{ isTeacher ? 'Управление курсами 🛠️' : 'Каталог знаний 📚' }}
        </h1>
        <p class="text-slate-400 font-bold mt-1">
          {{
            isTeacher
              ? 'Создавай шедевры и следи за успехами учеников'
              : 'Выбери свое следующее приключение'
          }}
        </p>
      </div>

      <NuxtLink
        v-if="isTeacher"
        to="/courses/create"
        class="bg-brand-green px-8 py-4 rounded-2xl font-black text-white shadow-[0_6px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3"
      >
        Создать новый курс 🚀
      </NuxtLink>
    </div>

    <!-- Filter Bar (Only for Student or if teacher wants to see all) -->
    <div
      v-if="!isTeacher"
      class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-5 md:p-6 rounded-[2rem] border-4 border-slate-100 shadow-sm"
    >
      <div
        class="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 w-full xl:w-auto custom-scrollbar no-scrollbar"
      >
        <button
          v-for="cat in ['Все', 'Python', 'Frontend', 'Design', 'AI']"
          :key="cat"
          @click="activeCategory = cat"
          class="px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all whitespace-nowrap"
          :class="[
            activeCategory === cat
              ? 'bg-brand-green text-white shadow-cartoon-sm'
              : 'bg-slate-50 text-slate-400 hover:bg-slate-100',
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div
        class="flex flex-col sm:flex-row items-start sm:items-center gap-4 font-bold text-slate-400 text-xs md:text-sm"
      >
        <span class="shrink-0 uppercase tracking-widest px-1">Фильтр по уровню:</span>
        <select
          v-model="activeLevel"
          class="w-full sm:w-auto bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 outline-none focus:border-brand-blue text-slate-600 font-black appearance-none cursor-pointer"
        >
          <option>Все уровни</option>
          <option>Новичок</option>
          <option>Средний</option>
          <option>Эксперт</option>
        </select>
      </div>
    </div>

    <!-- Courses Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-10">
      <div v-if="pending" class="col-span-full h-64 md:h-96 flex items-center justify-center">
        <div class="text-4xl md:text-5xl animate-bounce">🐍</div>
      </div>

      <template v-else-if="filteredCourses?.length">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="bg-white rounded-[2.5rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon overflow-hidden group hover:border-brand-blue transition-all flex flex-col"
        >
          <!-- Course Thumbnail -->
          <div
            class="h-44 md:h-52 bg-slate-900 relative overflow-hidden flex items-center justify-center shrink-0"
          >
            <div
              class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-shimmer"
            ></div>
            <span
              class="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-700 z-10"
            >
              {{
                course.category === 'Python'
                  ? '🐍'
                  : course.category === 'Frontend'
                    ? '⚛️'
                    : course.category === 'AI'
                      ? '🤖'
                      : '📚'
              }}
            </span>
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <div
                class="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20"
              >
                {{ course.category || 'Общее' }}
              </div>
              <div
                class="px-3 py-1 bg-brand-yellow rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-800 shadow-sm"
              >
                {{ course.level || 'Новичок' }}
              </div>
            </div>
            <!-- Price Tag -->
            <div
              v-if="!isTeacher"
              class="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-2xl shadow-premium border-2 border-slate-50 flex items-center gap-2"
            >
              <span class="text-xs font-black text-slate-800">{{
                course.price ? `${course.price} ₽` : 'Бесплатно'
              }}</span>
            </div>
            <div
              v-else
              class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border-2 border-slate-100 flex items-center gap-2"
            >
              <span
                v-if="course.isPublished"
                class="text-[10px] font-black text-brand-green uppercase tracking-widest"
                >В ЭФИРЕ 🟢</span
              >
              <span
                v-else
                class="text-[10px] font-black text-brand-orange uppercase tracking-widest"
                >ЧЕРНОВИК 🟠</span
              >
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 md:p-8 flex-grow flex flex-col">
            <!-- Teacher info -->
            <NuxtLink
              v-if="!isTeacher"
              :to="`/teacher/${course.teacher?.id}`"
              class="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity"
            >
              <div
                class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shadow-inner overflow-hidden border-2 border-slate-50"
              >
                <img
                  v-if="course.teacher?.avatar"
                  :src="course.teacher.avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else>👨‍🏫</span>
              </div>
              <div class="min-w-0">
                <p
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1"
                >
                  Мастер курса
                </p>
                <p class="text-xs font-black text-slate-800 truncate">
                  {{ course.teacher?.name || 'Анонимный мастер' }}
                </p>
              </div>
            </NuxtLink>

            <h3
              class="text-xl font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors mb-3"
            >
              {{ course.title }}
            </h3>

            <div
              class="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6"
            >
              <span class="flex items-center gap-1.5"
                >🎓 {{ course.plannedLessonsCount }} уроков</span
              >
              <span class="flex items-center gap-1.5"
                >🔥 {{ course.studentsCount || 0 }} учеников</span
              >
            </div>

            <!-- Prices & Mentoring -->
            <div class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 mb-6 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest"
                  >Курс:</span
                >
                <span class="text-xs font-black text-slate-800">{{
                  course.price ? `${course.price} ₽` : 'Бесплатно ✨'
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest"
                  >Менторинг:</span
                >
                <span
                  class="text-xs font-black"
                  :class="course.mentoringPrice ? 'text-brand-green' : 'text-slate-300'"
                >
                  {{ course.mentoringPrice ? `${course.mentoringPrice} ₽` : 'Недоступен' }}
                </span>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="pt-6 border-t-2 border-slate-50 mt-auto">
              <NuxtLink
                :to="isTeacher ? `/courses/builder/${course.id}` : `/courses/${course.id}`"
                class="w-full py-4 rounded-2xl flex items-center justify-center text-white text-sm font-black transition-all gap-3"
                :class="
                  isTeacher
                    ? 'bg-slate-900 shadow-cartoon-sm hover:translate-y-0.5'
                    : 'bg-brand-blue shadow-premium hover:scale-[1.02] active:scale-95'
                "
              >
                {{ isTeacher ? 'УПРАВЛЯТЬ СТУДИЕЙ ⚙️' : 'ПОДРОБНЕЕ О КУРСЕ 🚀' }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="col-span-full py-16 md:py-32 text-center bg-white rounded-[2.5rem] md:rounded-[3rem] border-4 border-dashed border-slate-100 space-y-6 px-6"
      >
        <div class="text-6xl md:text-7xl">{{ isTeacher ? '🏗️' : '🌵' }}</div>
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          {{ isTeacher ? 'У тебя пока нет курсов' : 'В этой пустыне пока нет курсов...' }}
        </h2>
        <p class="text-sm md:text-base text-slate-400 font-bold max-w-md mx-auto">
          {{
            isTeacher
              ? 'Пора создать свой первый шедевр и зажечь новые звезды в IT!'
              : 'Но мы активно работаем над тем, чтобы наполнить библиотеку самыми сочными приключениями!'
          }}
        </p>
        <NuxtLink
          v-if="isTeacher"
          to="/courses/create"
          class="inline-block bg-brand-green px-8 py-4 rounded-2xl font-black text-white shadow-[0_6px_0_0_#166534] hover:translate-y-0.5 transition-all"
        >
          Создать курс прямо сейчас
        </NuxtLink>
        <button
          v-else
          @click="router.back()"
          class="text-brand-green font-black underline decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8 transition-all hover:text-brand-green/70"
        >
          Назад к дашборду
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useCourseApi } from '@entities/course/api'
import { useTeacherStore } from '@entities/teacher/model/store'
import { useUserStore } from '@entities/user/model/store'
import type { Course } from '@shared/types'

const { getCourses } = useCourseApi()
const userStore = useUserStore()
const teacherStore = useTeacherStore()
const router = useRouter()

const isTeacher = computed(() => userStore.user?.role === 'TEACHER')
const activeCategory = ref('Все')
const activeLevel = ref('Все уровни')

const {
  data: allCourses,
  pending,
  refresh,
} = useAsyncData<Course[]>('courses-catalog-v2', () => getCourses() as Promise<Course[]>, {
  lazy: true,
  server: false,
  watch: [isTeacher],
})

const filteredCourses = computed(() => {
  let list = (allCourses.value || []).map((course) => {
    // Enrich with performance data if teacher
    if (isTeacher.value) {
      const performance = teacherStore.coursesPerformance.find((p) => p.id === course.id)
      if (performance) {
        return { ...course, ...performance }
      }
    }
    return course
  })

  if (activeCategory.value !== 'Все') {
    list = list.filter((c) => c.category === activeCategory.value)
  }

  if (activeLevel.value !== 'Все уровни') {
    list = list.filter((c) => (c.level || 'Новичок') === activeLevel.value)
  }

  return list
})

onMounted(async () => {
  refresh()
  if (isTeacher.value) {
    try {
      await teacherStore.fetchSummary()
    } catch {
      // failed fetch
    }
  }
})

definePageMeta({
  layout: 'main',
  middleware: ['auth'],
})
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 8px 0 0 #f1f5f9;
}
@media (min-width: 768px) {
  .shadow-cartoon {
    box-shadow: 0 10px 0 0 #f1f5f9;
  }
}
.shadow-cartoon-sm {
  box-shadow: 0 4px 0 0 #166534;
}
.animate-shimmer {
  animation: shimmer 15s linear infinite;
}
@keyframes shimmer {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 100%;
  }
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
