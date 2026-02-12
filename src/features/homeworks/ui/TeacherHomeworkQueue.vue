<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <template v-else-if="homeworks.length">
      <AppCard
        v-for="hw in homeworks"
        :key="hw.id"
        interactive
        class="flex flex-col md:flex-row items-center gap-6 md:gap-8"
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
            >
              {{ hw.courseTitle }}
            </span>
            <span
              class="text-[8px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-orange-100 text-brand-orange rounded-full"
            >
              Ждет проверки
            </span>
          </div>
          <AppHeading level="h3" size="sm" class="line-clamp-1">
            {{ hw.studentName }}
          </AppHeading>
          <p class="font-bold text-slate-400 text-sm">
            Обновлено: {{ formatDate(hw.submittedAt) }}
          </p>
        </div>

        <div
          class="shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t-2 md:border-t-0 border-slate-50"
        >
          <AppButton variant="primary" @click="navigateTo(`/homework/${hw.id}`)">
            ПРОВЕРИТЬ / ЧАТ 🚀
          </AppButton>
        </div>
      </AppCard>
    </template>

    <AppEmptyState
      v-else
      icon="🌴"
      title="Все проверено!"
      description="Студенты пока отдыхают, но ты можешь зайти в чаты с ними во вкладке «Ученики»."
    />
  </div>
</template>

<script setup lang="ts">
import type { TeacherDashboardSummary } from '~/entities/teacher/model/types'
import AppButton from '~/shared/ui/AppButton.vue'
import AppCard from '~/shared/ui/AppCard.vue'
import AppEmptyState from '~/shared/ui/AppEmptyState.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import { formatDate } from '~/shared/utils/date'

type RecentHomework = TeacherDashboardSummary['recentHomeworks'][number]

interface Props {
  homeworks: RecentHomework[]
  loading: boolean
}

defineProps<Props>()
</script>
