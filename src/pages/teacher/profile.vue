<template>
  <div class="space-y-10 animate-in fade-in duration-700 pb-20">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
      <div>
        <h1 class="text-4xl font-black text-slate-800 tracking-tight">Профиль Мастера 🎨</h1>
        <p class="text-slate-400 font-bold mt-1">
          Расскажи о себе миру, чтобы вдохновлять новых учеников
        </p>
      </div>
      <button
        @click="saveProfile"
        :disabled="isSaving"
        class="bg-brand-green px-10 py-5 rounded-2xl font-black text-white shadow-[0_8px_0_0_#166534] hover:translate-y-1 hover:shadow-[0_4px_0_0_#166534] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 group"
      >
        <span v-if="isSaving" class="animate-spin text-xl">⏳</span>
        <span v-else>Сохранить Профиль ✨</span>
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-10">
      <!-- Sidebar Tabs -->
      <aside class="xl:col-span-3 space-y-4">
        <div class="bg-white p-6 rounded-[2.5rem] border-4 border-slate-100 shadow-sm space-y-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full text-left px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-between group"
            :class="
              activeTab === tab.id
                ? 'bg-brand-blue text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            "
          >
            <span>{{ tab.label }}</span>
            <span v-if="activeTab === tab.id">🎯</span>
          </button>
        </div>

        <div
          class="bg-brand-orange/5 border-4 border-brand-orange/10 p-8 rounded-[2.5rem] space-y-4"
        >
          <div class="text-3xl">💡</div>
          <p class="text-xs font-bold text-brand-orange leading-relaxed">
            Качественно заполненный профиль повышает доверие учеников на 80%. Не забудь прикрепить
            видео-визитку!
          </p>
        </div>
      </aside>

      <!-- Main Form -->
      <main class="xl:col-span-9">
        <div
          class="bg-white p-8 md:p-12 rounded-[3rem] border-4 border-slate-100 shadow-cartoon min-h-[600px]"
        >
          <!-- Basic Info -->
          <div
            v-if="activeTab === 'basic'"
            class="space-y-8 animate-in fade-in slide-in-from-right-4"
          >
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">
              О себе и навыках
            </h2>

            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                >Обо мне (Биография)</label
              >
              <textarea
                v-model="profile.bio"
                rows="6"
                placeholder="Расскажи про свой путь в IT, почему ты любишь преподавать..."
                class="w-full bg-slate-50 border-4 border-slate-50 p-6 rounded-3xl font-bold text-slate-600 outline-none focus:border-brand-blue focus:bg-white transition-all resize-none shadow-inner"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                  >Предметы преподавания</label
                >
                <div
                  class="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border-4 border-slate-50"
                >
                  <span
                    v-for="(sub, idx) in profile.subjects"
                    :key="idx"
                    class="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    {{ sub }}
                    <button @click="removeSubject(idx)" class="hover:text-red-300">✕</button>
                  </span>
                  <input
                    @keyup.enter="addSubject"
                    placeholder="Добавить предмет..."
                    class="bg-transparent border-none outline-none font-bold text-xs uppercase tracking-widest text-slate-600 w-full mt-2"
                  />
                </div>
                <p class="text-[9px] text-slate-300 font-bold ml-4">
                  Нажми Enter после ввода названия
                </p>
              </div>

              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                  >Опыт (лет)</label
                >
                <input
                  v-model.number="profile.experience"
                  type="number"
                  class="w-full bg-slate-50 border-4 border-slate-50 px-6 py-5 rounded-2xl font-black text-slate-700 outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          <!-- Careers & Education -->
          <div
            v-if="activeTab === 'career'"
            class="space-y-8 animate-in fade-in slide-in-from-right-4"
          >
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">
              Карьера и Образование
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-8">
                <div class="space-y-3">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >Место работы</label
                  >
                  <input
                    v-model="profile.workplace"
                    placeholder="Напр: Google, Senior Software Engineer"
                    class="w-full bg-slate-50 border-4 border-slate-50 px-6 py-5 rounded-2xl font-black text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div class="space-y-3">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >Где преподаю</label
                  >
                  <input
                    v-model="profile.institution"
                    placeholder="Напр: МГУ, GeekBrains"
                    class="w-full bg-slate-50 border-4 border-slate-50 px-6 py-5 rounded-2xl font-black text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                  >Образование</label
                >
                <textarea
                  v-model="profile.education"
                  rows="6"
                  placeholder="Опиши свои ВУЗы и пройденные курсы..."
                  class="w-full bg-slate-50 border-4 border-slate-50 p-6 rounded-3xl font-bold text-slate-600 outline-none focus:border-brand-green focus:bg-white transition-all resize-none shadow-inner"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Video & Media -->
          <div
            v-if="activeTab === 'media'"
            class="space-y-10 animate-in fade-in slide-in-from-right-4"
          >
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Видео-визитка
            </h2>

            <div
              class="p-10 bg-slate-900 rounded-[3rem] border-8 border-white shadow-cartoon space-y-6"
            >
              <div class="space-y-3">
                <label class="text-[10px] font-black text-brand-green uppercase tracking-widest"
                  >URL Видео (YouTube/Vimeo)</label
                >
                <input
                  v-model="profile.videoUrl"
                  placeholder="https://..."
                  class="w-full bg-white/5 border-4 border-white/5 px-6 py-5 rounded-2xl font-mono text-white outline-none focus:border-brand-green focus:bg-white/10 transition-all shadow-inner"
                />
              </div>

              <div
                v-if="profile.videoUrl"
                class="aspect-video w-full bg-black rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl flex items-center justify-center"
              >
                <p class="text-slate-600 font-bold uppercase tracking-widest">
                  Превью видео будет здесь
                </p>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div
            v-if="activeTab === 'docs'"
            class="space-y-8 animate-in fade-in slide-in-from-right-4"
          >
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">
              Сертификаты и Достижения
            </h2>

            <div class="space-y-6">
              <div
                v-for="(cert, idx) in profile.certificates"
                :key="idx"
                class="flex gap-4 p-6 bg-slate-50 rounded-2xl border-4 border-slate-50 relative group"
              >
                <div
                  class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl shrink-0"
                >
                  📜
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                  <input
                    v-model="cert.title"
                    placeholder="Название..."
                    class="bg-transparent font-black text-slate-700 outline-none"
                  />
                  <input
                    v-model="cert.issuer"
                    placeholder="Кем выдан..."
                    class="bg-transparent font-bold text-slate-400 outline-none"
                  />
                  <input
                    v-model="cert.year"
                    placeholder="Год..."
                    class="bg-transparent font-bold text-slate-400 outline-none"
                  />
                </div>
                <button @click="removeCert(idx)" class="text-red-400 hover:text-red-600 px-4">
                  ✕
                </button>
              </div>

              <button
                @click="addCert"
                class="w-full py-6 border-4 border-dashed border-slate-100 rounded-2xl font-black text-slate-300 hover:border-brand-blue hover:text-brand-blue transition-all uppercase tracking-widest text-xs"
              >
                + Добавить сертификат
              </button>
            </div>
          </div>

          <!-- Social Links -->
          <div
            v-if="activeTab === 'social'"
            class="space-y-8 animate-in fade-in slide-in-from-right-4"
          >
            <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">
              Социальные сети
            </h2>

            <div v-if="profile.socialLinks" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div v-for="social in socialList" :key="social.id" class="space-y-3">
                <label
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                  >{{ social.label }}</label
                >
                <div
                  class="flex items-center gap-4 bg-slate-50 border-4 border-slate-50 px-6 py-5 rounded-2xl shadow-inner focus-within:border-brand-blue focus-within:bg-white transition-all"
                >
                  <span class="text-xl opacity-50">{{ social.icon }}</span>
                  <input
                    v-model="profile.socialLinks[social.id]"
                    placeholder="https://..."
                    class="bg-transparent w-full font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import { useTeacherApi } from '~/entities/teacher/api'
import type { TeacherProfile } from '~/entities/teacher/model/types'
import { useToast } from '~/shared/composables/useToast'

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
})

const teacherApi = useTeacherApi()
const toast = useToast()
const isSaving = ref(false)
const activeTab = ref('basic')

const tabs = [
  { id: 'basic', label: 'Основное' },
  { id: 'career', label: 'Карьера' },
  { id: 'media', label: 'Визитка' },
  { id: 'docs', label: 'Документы' },
  { id: 'social', label: 'Соцсети' },
]

const socialList = [
  { id: 'linkedin', label: 'LinkedIn', icon: '🔗' },
  { id: 'github', label: 'GitHub', icon: '💻' },
  { id: 'telegram', label: 'Telegram', icon: '✈️' },
  { id: 'website', label: 'Вебсайт', icon: '🌐' },
]

const profile = reactive<TeacherProfile>({
  id: '',
  userId: '',
  bio: '',
  videoUrl: '',
  subjects: [],
  institution: '',
  workplace: '',
  education: '',
  experience: 0,
  certificates: [],
  achievements: [],
  socialLinks: {
    linkedin: '',
    github: '',
    telegram: '',
    website: '',
  },
})

onMounted(async () => {
  try {
    const data = await teacherApi.getProfile()
    Object.assign(profile, data)
    if (!profile.socialLinks) {
      profile.socialLinks = { linkedin: '', github: '', telegram: '', website: '' }
    }
    if (!profile.certificates) profile.certificates = []
  } catch (err) {
    toast.error('Не удалось загрузить профиль')
  }
})

const addSubject = (e: Event) => {
  const target = e.target as HTMLInputElement
  const val = target.value.trim()
  if (val && !profile.subjects.includes(val)) {
    profile.subjects.push(val)
    target.value = ''
  }
}

const removeSubject = (idx: number) => {
  profile.subjects.splice(idx, 1)
}

const addCert = () => {
  if (!profile.certificates) profile.certificates = []
  profile.certificates.push({ title: '', issuer: '', year: '' })
}

const removeCert = (idx: number) => {
  profile.certificates?.splice(idx, 1)
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    const payload = JSON.parse(JSON.stringify(profile))
    delete payload.user // Remove loaded user info if any
    delete payload.id
    delete payload.userId

    await teacherApi.updateProfile(payload)
    toast.success('Профиль успешно обновлен! 🚀')
  } catch (err) {
    toast.error('Ошибка при сохранении')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
</style>
