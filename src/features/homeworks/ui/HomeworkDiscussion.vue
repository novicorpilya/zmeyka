<template>
  <div class="flex flex-col h-full space-y-6">
    <!-- Feedback Header -->
    <div
      v-if="homework.feedback || homework.score !== null"
      class="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-between"
    >
      <div v-if="homework.feedback" class="space-y-1">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Вердикт учителя:
        </p>
        <p class="font-bold text-slate-700">{{ homework.feedback }}</p>
      </div>
      <div v-if="homework.score !== null" class="text-right">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Оценка:</p>
        <div class="text-2xl font-black text-brand-green">{{ homework.score }} / 100</div>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="flex-grow space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
      <div
        v-for="comment in homework.comments"
        :key="comment.id"
        class="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
        :class="comment.authorId === userStore.user?.id ? 'flex-row-reverse text-right' : ''"
      >
        <div
          class="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-lg shrink-0"
        >
          {{ comment.author.role === 'TEACHER' ? '👨‍🏫' : '🐍' }}
        </div>
        <div class="space-y-2 max-w-[80%]">
          <div
            class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"
            :class="comment.authorId === userStore.user?.id ? 'flex-row-reverse' : ''"
          >
            <span>{{ comment.author.name }}</span>
            <span class="opacity-30">•</span>
            <span>{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div
            class="p-4 rounded-2xl shadow-sm border-2"
            :class="
              comment.authorId === userStore.user?.id
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-white text-slate-700 border-slate-100'
            "
          >
            <p class="text-sm font-bold leading-relaxed">{{ comment.text }}</p>
          </div>
        </div>
      </div>

      <div v-if="!homework.comments?.length" class="py-20 text-center opacity-30">
        <div class="text-4xl mb-4">💬</div>
        <p class="font-black uppercase tracking-widest text-xs">
          Здесь будет ваша переписка с учителем
        </p>
      </div>
    </div>

    <!-- Message Input -->
    <div class="pt-6 border-t-2 border-slate-50 flex gap-4">
      <input
        v-model="newComment"
        @keyup.enter="sendComment"
        :placeholder="
          homework.status === 'COMPLETED'
            ? 'Курс завершен, но можно спросить еще...'
            : 'Напиши свой вопрос учителю...'
        "
        class="flex-grow bg-slate-50 border-4 border-transparent focus:border-brand-blue/20 p-5 rounded-2xl font-bold text-sm outline-none transition-all"
      />
      <button
        @click="sendComment"
        :disabled="!newComment.trim() || isSending"
        class="px-8 py-4 bg-brand-blue text-white rounded-2xl font-black shadow-[0_6px_0_0_#1e40af] hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center min-w-[120px]"
      >
        <span v-if="!isSending">ОТПРАВИТЬ</span>
        <div
          v-else
          class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useUserStore } from '~/entities/user/model/store'
import { useHomeworksApi } from '~/features/homeworks/api'
import type { Homework } from '~/shared/types'

const props = defineProps<{
  homework: Homework
}>()

const emit = defineEmits(['refresh'])

const userStore = useUserStore()
const homeworksApi = useHomeworksApi()

const newComment = ref('')
const isSending = ref(false)

const sendComment = async () => {
  if (!newComment.value.trim() || isSending.value) return
  isSending.value = true
  try {
    await homeworksApi.addComment(props.homework.id, newComment.value)
    newComment.value = ''
    emit('refresh')
  } catch (err) {
    alert('Ошибка при отправке комментария')
  } finally {
    isSending.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 20px;
}
</style>
