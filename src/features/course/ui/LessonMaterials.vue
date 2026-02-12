<template>
  <div class="space-y-8 animate-in fade-in duration-300">
    <div class="flex items-center justify-between border-b-2 border-slate-50 pb-6">
      <AppHeading level="h2" size="md">
        {{ currentLesson?.title || 'Выбери урок' }}
      </AppHeading>
    </div>
    <div class="prose prose-slate max-w-none text-slate-600">
      <div
        v-if="currentLesson?.contentRich"
        class="whitespace-pre-wrap font-bold leading-relaxed"
        v-html="sanitizeHtml(currentLesson.contentRich)"
      ></div>
      <AppEmptyState v-else icon="📖" title="Материалы скоро появятся" />

      <!-- High-Impact Attachment Card -->
      <div
        v-if="currentLesson?.conspectusFile"
        class="mt-12 p-8 bg-brand-blue/5 rounded-[2.5rem] border-4 border-dashed border-brand-blue/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
      >
        <div class="flex items-center gap-6">
          <div
            class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-cartoon border-2 border-slate-50 relative"
          >
            📄
            <div
              class="absolute -top-2 -right-2 w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center animate-bounce shadow-sm"
            >
              <span class="text-[10px] font-black">!</span>
            </div>
          </div>
          <div>
            <h4 class="text-lg font-black text-slate-800 tracking-tight">
              Дополнительные материалы
            </h4>
            <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Скачай конспект или инструкцию к уроку
            </p>
          </div>
        </div>
        <AppButton variant="secondary" @click="openFile(currentLesson.conspectusFile)">
          СКАЧАТЬ ФАЙЛ ⬇️
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Lesson } from '~/entities/course/model/types'
import AppButton from '~/shared/ui/AppButton.vue'
import AppEmptyState from '~/shared/ui/AppEmptyState.vue'
import AppHeading from '~/shared/ui/AppHeading.vue'
import { sanitizeHtml } from '~/shared/utils/sanitizer'

interface Props {
  currentLesson: Lesson | null
  formatFileUrl: (path?: string) => string
}

const props = defineProps<Props>()

const openFile = (path?: string) => {
  if (path) window.open(props.formatFileUrl(path), '_blank')
}
</script>
