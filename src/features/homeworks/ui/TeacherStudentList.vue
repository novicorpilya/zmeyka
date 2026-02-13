<template>
  <div class="space-y-6">
    <AppCard
      v-for="student in students"
      :key="student.id"
      variant="outlined"
      padding="sm"
      class="flex items-center gap-6 group hover:border-brand-blue"
    >
      <div
        class="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform"
      >
        {{ student.avatar || '🐍' }}
      </div>
      <div class="flex-grow min-w-0">
        <h3 class="font-black text-slate-800 text-lg uppercase tracking-tight truncate">
          {{ student.name }}
        </h3>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">
          {{ student.email }}
        </p>
        <div class="mt-2 flex items-center gap-3">
          <span
            class="text-[9px] font-black text-brand-blue px-2 py-0.5 bg-brand-blue/5 rounded-full uppercase tracking-widest"
          >
            Сдано работ: {{ student.homeworksCount }}
          </span>
        </div>
      </div>
      <div class="shrink-0">
        <AppButton
          v-if="student.lastHomeworkId"
          size="sm"
          variant="secondary"
          @click="navigateTo(`/homework/${student.lastHomeworkId}`)"
        >
          💬 ЧАТ
        </AppButton>
        <AppButton v-else size="sm" variant="outline" @click="$emit('createChat', student.id)">
          ➕ ОБЩЕНИЕ
        </AppButton>
      </div>
    </AppCard>

    <AppEmptyState v-if="!students.length" title="Учеников пока нет..." />
  </div>
</template>

<script setup lang="ts">
import AppButton from '@shared/ui/AppButton.vue'
import AppCard from '@shared/ui/AppCard.vue'
import AppEmptyState from '@shared/ui/AppEmptyState.vue'

interface Student {
  id: string
  name: string
  email: string
  avatar: string | null
  homeworksCount: number
  lastHomeworkId: string | null
}

interface Props {
  students: Student[]
}

defineProps<Props>()
defineEmits(['createChat'])
</script>
