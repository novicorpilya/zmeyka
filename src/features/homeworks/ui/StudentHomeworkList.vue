<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <template v-else-if="tasks.length">
      <AppCard
        v-for="task in formattedTasks"
        :key="task.id"
        interactive
        class="flex flex-col md:flex-row items-center gap-6 md:gap-8"
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
            >
              {{ task.course }}
            </span>
            <span
              v-if="task.isOverdue"
              class="text-[8px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-red-100 text-red-500 rounded-full animate-pulse"
            >
              Просрочено!
            </span>
          </div>
          <AppHeading level="h3" size="sm" class="line-clamp-1">
            {{ task.title }}
          </AppHeading>
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
          <AppButton :variant="task.variant" @click="navigateTo(task.link)" class="w-full">
            {{ task.buttonText }}
          </AppButton>
        </div>
      </AppCard>
    </template>

    <AppEmptyState
      v-else
      icon="🏜️"
      title="Список пуст!"
      description="Ты еще не сдавал работы на проверку. Выбери любой урок и начни приключение!"
    >
      <AppButton variant="primary" @click="navigateTo('/courses')"> В КАТАЛОГ КУРСОВ 📚 </AppButton>
    </AppEmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Homework } from '@shared/types'
import AppButton from '@shared/ui/AppButton.vue'
import AppCard from '@shared/ui/AppCard.vue'
import AppEmptyState from '@shared/ui/AppEmptyState.vue'
import AppHeading from '@shared/ui/AppHeading.vue'

interface Props {
  tasks: Homework[]
  loading?: boolean
}

const props = defineProps<Props>()

const formattedTasks = computed(() => {
  return props.tasks.map((hw: Homework) => {
    const isCompleted = hw.status === 'COMPLETED'
    const isRejected = hw.status === 'REJECTED'
    const isChecking = hw.status === 'CHECKING'
    const isNotStarted = hw.status === 'NOT_STARTED'

    return {
      id: hw.id,
      icon: isCompleted ? '✅' : isRejected ? '❌' : isChecking ? '🕵️‍♂️' : isNotStarted ? '🚀' : '⏳',
      statusBg: isCompleted
        ? 'bg-brand-green/10'
        : isRejected
          ? 'bg-red-50'
          : isChecking
            ? 'bg-brand-orange/10'
            : isNotStarted
              ? 'bg-brand-blue/10'
              : 'bg-slate-50',
      course: hw.course?.title || hw.courseTitle || 'Курс',
      title: hw.lesson?.title || 'Урок',
      description:
        hw.feedback ||
        (isCompleted
          ? 'Отличная работа! Можешь двигаться дальше.'
          : isNotStarted
            ? 'Прочитай материалы урока и выполни задание, чтобы открыть чат с учителем.'
            : 'Твоя работа находится на проверке у ИИ или наставника.'),
      statusColor: isCompleted
        ? 'text-brand-green'
        : isRejected
          ? 'text-red-500'
          : isNotStarted
            ? 'text-brand-blue'
            : 'text-slate-400',
      statusText: isCompleted
        ? 'Выполнено'
        : isRejected
          ? 'Нужны правки'
          : isChecking
            ? 'ИИ Проверяет'
            : isNotStarted
              ? 'Не начато'
              : 'На проверке',
      link: isNotStarted ? `/courses/${hw.courseId}?lesson=${hw.lessonId}` : `/homework/${hw.id}`,
      variant: (isRejected ? 'danger' : isCompleted ? 'primary' : 'secondary') as
        | 'primary'
        | 'secondary'
        | 'danger',
      buttonText: isRejected ? 'ИСПРАВИТЬ' : isNotStarted ? 'НАЧАТЬ' : 'ПЕРЕЙТИ В ЧАТ',
      isOverdue: false,
    }
  })
})
</script>
