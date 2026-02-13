<template>
  <div class="py-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
    <!-- If current lesson is a preview, show ITS video here as a demo -->
    <div
      v-if="currentLesson?.isPreview && currentLesson.videoUrl"
      class="relative aspect-video max-w-2xl mx-auto rounded-[2.5rem] border-8 border-white shadow-cartoon overflow-hidden group"
    >
      <video
        :src="formatFileUrl(currentLesson.videoUrl)"
        controls
        crossorigin="anonymous"
        class="w-full h-full object-cover"
      ></video>
      <div
        class="absolute top-4 left-4 px-4 py-2 bg-brand-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 pointer-events-none shadow-sm"
      >
        Демо-урок 📺
      </div>
    </div>

    <!-- Otherwise, if no preview video, show the classic premium icon -->
    <div
      v-else
      class="w-24 h-24 bg-brand-yellow/20 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-inner"
    >
      💎
    </div>

    <div class="max-w-md mx-auto space-y-4">
      <AppHeading level="h3" size="md" center uppercase> Эксклюзивный контент </AppHeading>
      <p class="text-slate-500 font-bold leading-relaxed px-4">
        Материалы урока, техническое задание для практики и чат с учителем доступны только после
        записи на курс.
      </p>
    </div>

    <AppButton
      size="lg"
      variant="primary"
      class="mx-auto"
      :loading="isEnrolling"
      @click="$emit('enroll')"
    >
      {{ (price ?? 0) > 0 ? `ОТКРЫТЬ ДОСТУП — ${price} ₽` : 'ЗАПИСАТЬСЯ БЕСПЛАТНО' }}
      <span class="group-hover:translate-x-2 transition-transform">🚀</span>
    </AppButton>

    <div
      v-if="mentoringPrice"
      class="inline-flex items-center gap-3 px-6 py-3 bg-brand-blue/5 rounded-2xl border-2 border-brand-blue/10"
    >
      <span class="text-xl">🤝</span>
      <p class="text-[10px] font-black text-brand-blue uppercase tracking-widest">
        Доступен чат с наставником: +{{ mentoringPrice }} ₽
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Lesson } from '@entities/course/model/types'
import AppButton from '@shared/ui/AppButton.vue'
import AppHeading from '@shared/ui/AppHeading.vue'

interface Props {
  currentLesson: Lesson | null
  isEnrolling: boolean
  price?: number
  mentoringPrice?: number
  formatFileUrl: (path?: string) => string
}

defineProps<Props>()
defineEmits(['enroll'])
</script>
