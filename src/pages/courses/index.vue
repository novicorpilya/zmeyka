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
          class="w-full sm:w-auto bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 outline-none focus:border-brand-blue text-slate-600 font-black"
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
            class="h-40 md:h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center shrink-0"
          >
            <div
              class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-shimmer"
            ></div>
            <span
              class="text-5xl md:text-6xl group-hover:scale-125 transition-transform duration-500 z-10"
            >
              {{ isTeacher ? '🛠️' : '📚' }}
            </span>
            <div
              class="absolute top-4 right-4 px-3 py-1 bg-brand-yellow rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm"
            >
              {{ course.level || 'Новичок' }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 md:p-8 flex-grow flex flex-col space-y-4">
            <div
              class="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-brand-blue uppercase tracking-widest"
            >
              <span>{{ course.category || 'Программирование' }}</span>
              <span>•</span>
              <span>{{ isTeacher ? (course.studentsCount || 0) + ' учеников' : '12 уроков' }}</span>
            </div>
            <h3
              class="text-lg md:text-xl font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors"
            >
              {{ course.title }}
            </h3>
            <p class="text-xs md:text-sm font-bold text-slate-400 line-clamp-2 md:line-clamp-3">
              {{ course.description }}
            </p>

            <!-- Footer info -->
            <div class="pt-5 border-t-2 border-slate-50 flex items-center justify-between mt-auto">
              <div v-if="!isTeacher" class="flex items-center gap-2">
                <div
                  class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 uppercase text-[8px] md:text-[10px] font-black shrink-0"
                >
                  {{ course.teacher?.name?.[0] || 'П' }}
                </div>
                <span
                  class="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[80px] sm:max-w-none"
                >
                  {{ course.teacher?.name || 'Мастер' }}
                </span>
              </div>
              <div
                v-else
                class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                <span v-if="course.isPublished" class="text-brand-green">В эфире 🟢</span>
                <span v-else class="text-brand-orange">Черновик 🟠</span>
              </div>

              <NuxtLink
                :to="isTeacher ? `/courses/builder/${course.id}` : `/courses/${course.id}`"
                class="bg-brand-blue px-4 h-9 md:h-10 rounded-xl flex items-center justify-center text-white text-xs md:text-sm font-black shadow-[0_4px_0_0_#1e40af] hover:translate-y-0.5 hover:shadow-none active:translate-y-1 transition-all gap-2"
              >
                {{ isTeacher ? 'КОНСТРУКТОР' : '🚀' }}
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
import { useCourseApi } from '~/entities/course/api'
import { useTeacherStore } from '~/entities/teacher/model/store'
import { useUserStore } from '~/entities/user/model/store'
import type { Course } from '~/shared/types'

const { getCourses } = useCourseApi()
const userStore = useUserStore()
const teacherStore = useTeacherStore()
const router = useRouter()

const isTeacher = computed(() => userStore.user?.role === 'TEACHER')
const activeCategory = ref('Все')

const {
  data: allCourses,
  pending,
  refresh,
} = await useAsyncData<Course[]>('courses-catalog', () => getCourses() as Promise<Course[]>)

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

  if (isTeacher.value) {
    return list.filter((c: Course) => c.teacherId === userStore.user?.id)
  }

  if (activeCategory.value === 'Все') return list
  return list.filter((c) => c.category === activeCategory.value)
})

onMounted(async () => {
  refresh()
  if (isTeacher.value) {
    await teacherStore.fetchSummary()
  }
})

definePageMeta({
  layout: 'app',
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
