<template>
  <form @submit.prevent="handleSubmit" class="space-y-8 max-w-2xl mx-auto p-12 bg-white rounded-[3rem] border-4 border-slate-100 shadow-cartoon">
    <div class="text-center space-y-2">
      <div class="text-5xl">✍️</div>
      <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tight">Новое приключение</h2>
      <p class="font-bold text-slate-400 uppercase tracking-widest text-xs">Заполни анкету курса</p>
    </div>

    <div class="space-y-6">
      <div class="space-y-3">
        <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-4">Название курса</label>
        <input 
          v-model="form.title" 
          type="text" 
          placeholder="Напр: Магия Python со Змейкой"
          class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl font-bold focus:border-brand-green/50 outline-none transition-all text-slate-700 placeholder:text-slate-300"
          required
        />
      </div>

      <div class="space-y-3">
        <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-4">Описание</label>
        <textarea 
          v-model="form.description" 
          rows="4"
          placeholder="О чем будет этот курс?"
          class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl font-bold focus:border-brand-green/50 outline-none transition-all text-slate-700 resize-none placeholder:text-slate-300"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-4">Твой ID Учителя</label>
          <input 
            v-model="form.teacherId" 
            type="text" 
            placeholder="UUID из Swagger"
            class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl font-bold focus:border-brand-blue/50 outline-none transition-all text-slate-700 placeholder:text-slate-300"
            required
          />
        </div>
        <div class="space-y-3">
          <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-4">Видео (JSON)</label>
          <input 
            v-model="form.videoUrls" 
            type="text" 
            placeholder='["url"]'
            class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl font-bold focus:border-brand-orange/50 outline-none transition-all text-slate-700 placeholder:text-slate-300"
            required
          />
        </div>
      </div>
    </div>

    <button 
      type="submit" 
      :disabled="loading"
      class="w-full py-6 bg-brand-green hover:bg-emerald-400 text-white rounded-[2rem] font-black text-xl shadow-[0_10px_0_0_#166534] hover:translate-y-1 hover:shadow-[0_6px_0_0_#166534] transition-all active:translate-y-2 active:shadow-none btn-bouncy disabled:opacity-50"
    >
      {{ loading ? 'Создаем...' : 'Опубликовать ✨' }}
    </button>

    <div v-if="error" class="p-4 bg-rose-50 border-4 border-rose-100 rounded-2xl text-rose-500 font-bold text-center">
      🙊 Ой! {{ error }}
    </div>
    
    <div v-if="success" class="p-4 bg-emerald-50 border-4 border-emerald-100 rounded-2xl text-brand-green font-black text-center animate-bounce">
      ✅ Ура! Курс успешно создан! 🎉
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCourseApi } from '@entities/course/api'

const { createCourse } = useCourseApi()

const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  title: '',
  description: '',
  teacherId: '',
  videoUrls: '[]',
  quizzes: '[]'
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    await createCourse(form)
    success.value = true
    setTimeout(() => {
      form.title = ''
      form.description = ''
      success.value = false
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Ошибка при создании'
  } finally {
    loading.value = false
  }
}
</script>
