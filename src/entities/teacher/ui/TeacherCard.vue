<template>
  <div
    v-if="teacherData"
    class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-6"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Твой наставник</h3>
      <div class="w-8 h-8 rounded-lg bg-brand-yellow/20 flex items-center justify-center text-sm">
        ✨
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div
        class="w-16 h-16 rounded-2xl border-4 border-slate-50 shadow-sm overflow-hidden shrink-0"
      >
        <img
          v-if="teacherData.avatar"
          :src="teacherData.avatar"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center text-2xl">
          👨‍🏫
        </div>
      </div>
      <div>
        <p class="font-black text-slate-800 italic uppercase tracking-tighter">
          {{ teacherData.name }}
        </p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Expert Navigator
        </p>
      </div>
    </div>

    <div v-if="profile" class="space-y-4 animate-in fade-in duration-500">
      <p class="text-xs font-bold text-slate-500 leading-relaxed line-clamp-3 italic">
        "{{ profile.bio || 'Помогу тебе освоить Python с нуля до первого проекта!' }}"
      </p>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="sub in profile.subjects?.slice(0, 3)"
          :key="sub"
          class="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase"
        >
          {{ sub }}
        </span>
      </div>

      <NuxtLink
        v-if="teacherData"
        :to="`/teacher/${teacherData.id}`"
        class="block w-full py-3 bg-brand-blue/5 text-brand-blue border-2 border-brand-blue/10 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all shadow-sm active:translate-y-0.5"
      >
        Подробнее о мастере 🎨
      </NuxtLink>
    </div>

    <div v-else-if="pending" class="py-4 flex justify-center">
      <div
        class="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useTeacherApi } from '@entities/teacher/api'
import type { User } from '@shared/types'

const props = defineProps<{
  teacher?: User | null
}>()

const teacherApi = useTeacherApi()

const teacherData = computed(() => {
  if (!props.teacher) return null
  return {
    id: props.teacher.id,
    name: props.teacher.name || 'Мастер Знаний',
    avatar: props.teacher.avatar || null,
  }
})

const { data: profile, pending } = useAsyncData(
  `sidebar-teacher-${props.teacher?.id || 'unknown'}`,
  () => (props.teacher?.id ? teacherApi.getPublicProfile(props.teacher.id) : Promise.resolve(null)),
  { watch: [() => props.teacher?.id] },
)
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
</style>
