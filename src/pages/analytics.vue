<template>
  <div class="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="space-y-2 text-center md:text-left px-2">
      <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
        {{ isTeacher ? 'Аналитика курсов 📈' : 'Мой прогресс 📈' }}
      </h1>
      <p class="text-base md:text-lg font-bold text-slate-400">
        {{
          isTeacher
            ? 'Следи за вовлеченностью и успехами твоих студентов'
            : 'Твои навыки растут не по дням, а по часам!'
        }}
      </p>
    </div>

    <!-- Teacher: Global Stats -->
    <div v-if="isTeacher" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in teacherSummary"
        :key="stat.label"
        class="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon flex flex-col items-center text-center group"
      >
        <div
          class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform"
        >
          {{ stat.icon }}
        </div>
        <div class="text-3xl font-black text-slate-800">{{ stat.value }}</div>
        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
          {{ stat.label }}
        </div>
      </div>
    </div>

    <!-- Grid: Conditional Display -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
      <!-- Left Column: Primary Data -->
      <div class="lg:col-span-8 space-y-8 md:space-y-10">
        <!-- TEACHER: Detailed Course Performance -->
        <div
          v-if="isTeacher"
          class="bg-white p-8 md:p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8"
        >
          <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Эффективность контента
          </h3>
          <div class="space-y-8">
            <div
              v-for="course in teacherStore.coursesPerformance"
              :key="course.id"
              class="space-y-4"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 class="text-xl font-black text-slate-700">{{ course.title }}</h4>
                <span class="text-brand-blue font-black text-sm uppercase tracking-widest"
                  >{{ course.completionRate }}% усвоено</span
                >
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="metric in ['Просмотры', 'ДЗ сдано', 'ДРОП-ОФФ']"
                  :key="metric"
                  class="p-3 bg-slate-50 rounded-xl text-center"
                >
                  <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    {{ metric }}
                  </p>
                  <p class="text-lg font-black text-slate-600">
                    {{ Math.floor(Math.random() * 100) + 20 }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STUDENT: Skill Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
          <div
            v-for="skill in skills"
            :key="skill.name"
            class="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon flex flex-col items-center text-center space-y-4 md:space-y-6 group hover:translate-y-[-4px] transition-all"
          >
            <div
              class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 md:border-8 p-2 transition-all"
              :class="skill.borderColor"
            >
              <div
                class="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-3xl md:text-5xl group-hover:scale-110 transition-transform"
              >
                {{ skill.icon }}
              </div>
            </div>
            <div class="space-y-1">
              <h3 class="text-xl md:text-2xl font-black text-slate-800">{{ skill.name }}</h3>
              <p class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
                {{ skill.level }}
              </p>
            </div>
            <div class="w-full h-2.5 md:h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-1000"
                :class="skill.barColor"
                :style="{ width: skill.progress + '%' }"
              ></div>
            </div>
            <p class="font-bold text-slate-500 text-[10px] md:text-sm">
              {{ skill.progress }}% до следующего уровня
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Secondary Data (Activity etc) -->
      <div class="lg:col-span-4 space-y-8 md:space-y-10">
        <div class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8">
          <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight shrink-0">
            {{ isTeacher ? 'Последние события' : 'Движ' }}
          </h3>
          <div class="space-y-6">
            <div v-for="i in 3" :key="i" class="flex gap-4">
              <div class="w-2 h-2 rounded-full bg-brand-green mt-2 shrink-0"></div>
              <div>
                <p class="text-xs font-bold text-slate-500">Студент сдал работу по курсу Python</p>
                <p class="text-[10px] text-slate-300">2 часа назад</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTeacherStore } from '~/entities/teacher/model/store'
import { useUserStore } from '~/entities/user/model/store'

const userStore = useUserStore()
const teacherStore = useTeacherStore()

const isTeacher = computed(() => userStore.user?.role === 'TEACHER')

onMounted(async () => {
  if (isTeacher.value) {
    await teacherStore.fetchSummary()
  }
})

const teacherSummary = computed(() => [
  { label: 'Всего студентов', value: teacherStore.stats.totalStudents, icon: '👥' },
  { label: 'Сдано ДЗ за неделю', value: 42, icon: '📝' },
  { label: 'Avg. Score', value: '4.8', icon: '⭐' },
  { label: 'Completion Rate', value: '78%', icon: '🚀' },
])

const skills = [
  {
    name: 'Python',
    level: 'Адепт Кода',
    progress: 65,
    icon: '🐍',
    borderColor: 'border-brand-green',
    barColor: 'bg-brand-green',
  },
  {
    name: 'Логика',
    level: 'Мыслитель',
    progress: 40,
    icon: '🧠',
    borderColor: 'border-brand-blue',
    barColor: 'bg-brand-blue',
  },
  {
    name: 'Frontend',
    level: 'Новичок',
    progress: 15,
    icon: '✨',
    borderColor: 'border-brand-yellow',
    barColor: 'bg-brand-yellow',
  },
]

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
})
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
</style>
