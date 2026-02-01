<template>
  <div class="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
      <h1
        class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight text-center sm:text-left"
      >
        {{ isTeacher ? 'Проверка работ ⚖️' : 'Мои домашки 📝' }}
      </h1>
      <div
        v-if="isTeacher"
        class="px-4 py-2.5 md:px-6 md:py-3 bg-white rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-slate-500 shadow-sm text-center text-xs md:text-sm"
      >
        Нужно проверить:
        <span class="text-brand-orange font-black">{{ teacherStore.stats.pendingHomeworks }}</span>
      </div>
      <div
        v-else
        class="px-4 py-2.5 md:px-6 md:py-3 bg-white rounded-xl md:rounded-2xl border-2 border-slate-100 font-bold text-slate-500 shadow-sm text-center text-xs md:text-sm"
      >
        Осталось выполнить: <span class="text-brand-orange font-black">2</span>
      </div>
    </div>

    <!-- Teacher: Grading List -->
    <div v-if="isTeacher" class="space-y-6">
      <div v-if="teacherStore.isLoading" class="flex justify-center py-20">
        <div
          class="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <template v-else-if="teacherStore.recentHomeworks.length">
        <div
          v-for="hw in teacherStore.recentHomeworks"
          :key="hw.id"
          class="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon hover:border-brand-blue transition-all group flex flex-col md:flex-row items-center gap-6 md:gap-8"
        >
          <div
            class="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center text-3xl md:text-4xl shrink-0"
          >
            👤
          </div>

          <div class="flex-grow space-y-2 text-center md:text-left min-w-0">
            <div class="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3">
              <span
                class="text-[8px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-brand-blue/10 text-brand-blue rounded-full truncate max-w-[200px]"
                >{{ hw.courseTitle }}</span
              >
              <span
                class="text-[8px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-orange-100 text-brand-orange rounded-full"
                >Ждет проверки</span
              >
            </div>
            <h3 class="text-xl md:text-2xl font-black text-slate-800 line-clamp-1">
              Работу сдал: {{ hw.studentName }}
            </h3>
            <p class="font-bold text-slate-400 text-sm">Сдано: {{ formatDate(hw.submittedAt) }}</p>
          </div>

          <div
            class="shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t-2 md:border-t-0 border-slate-50"
          >
            <button
              class="w-full md:w-auto bg-brand-green py-3.5 md:py-4 px-8 rounded-xl font-black text-white shadow-[0_4px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none transition-all text-xs md:text-sm active:translate-y-1"
            >
              ПРОВЕРИТЬ СЕЙЧАС 🚀
            </button>
          </div>
        </div>
      </template>

      <div
        v-else
        class="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 space-y-6 px-6"
      >
        <div class="text-6xl">🌴</div>
        <h2 class="text-2xl font-black text-slate-800">Все проверено!</h2>
        <p class="text-slate-400 font-bold">Студенты пока отдыхают, и тебе пора.</p>
      </div>
    </div>

    <!-- Student: Task List -->
    <div v-else class="space-y-6">
      <div
        v-for="task in studentTasks"
        :key="task.id"
        class="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon hover:border-brand-blue transition-all group flex flex-col md:flex-row items-center gap-6 md:gap-8"
      >
        <div
          class="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl shrink-0"
          :class="task.statusBg"
        >
          {{ task.icon }}
        </div>

        <div class="flex-grow space-y-2 text-center md:text-left min-w-0">
          <div class="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3">
            <span
              class="text-[8px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-400 rounded-full truncate max-w-[150px]"
              >{{ task.course }}</span
            >
            <span
              v-if="task.isOverdue"
              class="text-[8px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-red-100 text-red-500 rounded-full animate-pulse"
              >Просрочено!</span
            >
          </div>
          <h3 class="text-xl md:text-2xl font-black text-slate-800 line-clamp-1">
            {{ task.title }}
          </h3>
          <p class="font-bold text-slate-400 text-sm line-clamp-2 md:line-clamp-none">
            {{ task.description }}
          </p>
        </div>

        <div
          class="shrink-0 w-full md:w-auto space-y-3 md:space-y-4 pt-4 md:pt-0 border-t-2 md:border-t-0 border-slate-50"
        >
          <div
            class="flex items-center justify-center md:justify-end gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest"
            :class="task.statusColor"
          >
            <span>{{ task.statusText }}</span>
          </div>
          <NuxtLink
            :to="task.link"
            class="block text-center py-3.5 md:py-4 px-6 md:px-8 rounded-xl font-black text-white shadow-cartoon-sm hover:translate-y-0.5 hover:shadow-none transition-all text-xs md:text-sm active:translate-y-1"
            :class="task.buttonClass"
          >
            {{ task.buttonText }}
          </NuxtLink>
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const studentTasks = [
  {
    id: 1,
    title: 'Циклы и Списки',
    description: 'Напиши программу для перебора всех фруктов в корзине.',
    course: 'Python Базовый',
    icon: '🐍',
    statusBg: 'bg-brand-orange/10',
    statusColor: 'text-brand-orange',
    statusText: 'На проверке ИИ',
    buttonText: 'Узнать статус',
    buttonClass: 'bg-brand-orange shadow-[0_4px_0_0_#c2410c]',
    link: '/courses',
    isOverdue: false,
  },
  {
    id: 2,
    title: 'Верстка Кнопки',
    description: 'Создай самую крутую кнопку на CSS во всей округе.',
    course: 'Frontend Магия',
    icon: '🎨',
    statusBg: 'bg-slate-50',
    statusColor: 'text-slate-400',
    statusText: 'Нужно сделать',
    buttonText: 'Начать выполнение',
    buttonClass: 'bg-brand-blue shadow-[0_4px_0_0_#1e40af]',
    link: '/courses',
    isOverdue: true,
  },
]

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
  box-shadow: 0 4px 0 0 #1e293b;
}
</style>
