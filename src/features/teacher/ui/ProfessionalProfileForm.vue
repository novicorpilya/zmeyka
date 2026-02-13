<template>
  <div class="space-y-10">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-black font-display text-slate-800 uppercase tracking-tight">
        Публичный профиль 🎨
      </h2>
      <button
        @click="saveProfile"
        :disabled="isSaving"
        class="bg-brand-green px-8 py-4 rounded-xl font-black text-white shadow-cartoon-sm hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 text-sm shimmer-button"
      >
        <span v-if="isSaving">⏳</span>
        <span v-else>Сохранить изменения ✨</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <input
        ref="videoFileInput"
        type="file"
        accept="video/*"
        class="hidden"
        @change="handleVideoUpload"
      />
      <input
        ref="certFileInput"
        type="file"
        accept=".pdf"
        class="hidden"
        @change="handleCertUpload"
      />

      <!-- Tabs within Profile -->
      <nav class="lg:col-span-3 space-y-2">
        <button
          v-for="t in subTabs"
          :key="t.id"
          @click="activeSubTab = t.id"
          class="w-full text-left px-5 py-3 rounded-xl font-black font-display text-xs uppercase tracking-widest transition-all shrink-0"
          :class="
            activeSubTab === t.id
              ? 'bg-brand-blue text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-50'
          "
        >
          {{ t.label }}
        </button>
      </nav>

      <div
        class="lg:col-span-9 bg-slate-50/50 p-6 md:p-8 rounded-[2.5rem] border-4 border-slate-50"
      >
        <!-- Basic Info -->
        <div v-if="activeSubTab === 'basic'" class="space-y-6">
          <div class="space-y-3">
            <label
              class="text-[10px] font-black font-display text-slate-400 uppercase tracking-widest ml-4"
              >Обо мне</label
            >
            <textarea
              v-model="profile.bio"
              rows="5"
              class="w-full bg-white border-4 border-white p-6 rounded-2xl font-bold text-slate-600 outline-none focus:border-brand-blue transition-all resize-none shadow-sm"
            ></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                >Опыт (лет)</label
              >
              <input
                v-model.number="profile.experience"
                type="number"
                class="w-full bg-white border-4 border-white px-6 py-4 rounded-xl font-black text-slate-700 outline-none focus:border-brand-blue shadow-sm"
              />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                >Предметы (Enter)</label
              >
              <div
                class="flex flex-wrap gap-2 p-3 bg-white rounded-xl border-4 border-white shadow-sm"
              >
                <span
                  v-for="(s, i) in profile.subjects"
                  :key="i"
                  class="px-2 py-1 bg-brand-blue text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-2"
                >
                  {{ s }} <button @click="profile.subjects.splice(i, 1)">✕</button>
                </span>
                <input
                  @keyup.enter="addSubject"
                  class="bg-transparent border-none outline-none font-bold text-[10px] uppercase w-full mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Career -->
        <div v-if="activeSubTab === 'career'" class="space-y-6">
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
              >Место работы</label
            >
            <input
              v-model="profile.workplace"
              class="w-full bg-white border-4 border-white px-6 py-4 rounded-xl font-black text-slate-700 outline-none focus:border-brand-blue shadow-sm"
            />
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
              >Образование</label
            >
            <textarea
              v-model="profile.education"
              rows="4"
              class="w-full bg-white border-4 border-white p-6 rounded-2xl font-bold text-slate-600 outline-none focus:border-brand-blue transition-all resize-none shadow-sm"
            ></textarea>
          </div>
        </div>

        <!-- Media -->
        <div v-if="activeSubTab === 'media'" class="space-y-6">
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
              >Видео визитка</label
            >
            <div class="flex gap-4">
              <input
                v-model="profile.videoUrl"
                placeholder="Ссылка на YouTube / Vimeo"
                class="flex-grow bg-white border-4 border-white px-6 py-4 rounded-xl font-black text-slate-700 outline-none focus:border-brand-blue shadow-sm"
              />
              <button
                @click="videoFileInput?.click()"
                :disabled="isUploading"
                class="bg-white px-6 py-4 rounded-xl border-4 border-white shadow-sm font-black text-sm hover:border-brand-blue transition-all flex items-center gap-2"
              >
                <span>{{ isUploading ? '⏳' : '📁' }}</span>
                <span>{{ isLocalVideo ? 'Заменить файл' : 'Загрузить видео' }}</span>
              </button>
            </div>
            <p
              v-if="isLocalVideo"
              class="text-[10px] font-bold text-brand-green uppercase tracking-widest ml-4 flex items-center gap-2"
            >
              <span>✅ ВИДЕО ЗАГРУЖЕНО ФАЙЛОМ</span>
              <button @click="profile.videoUrl = ''" class="text-red-400 hover:underline">
                Удалить
              </button>
            </p>
          </div>
          <div
            v-if="profile.videoUrl"
            class="aspect-video bg-slate-900 rounded-3xl flex items-center justify-center text-slate-500 font-black uppercase text-[10px] tracking-widest shadow-cartoon"
          >
            <video
              v-if="isLocalVideo"
              :src="formatFileUrl(profile.videoUrl)"
              controls
              class="w-full h-full rounded-2xl"
            ></video>
            <span v-else>Превью ссылки активно 🎬</span>
          </div>
        </div>

        <!-- Documents -->
        <div v-if="activeSubTab === 'docs' && profile.certificates" class="space-y-4">
          <div
            v-for="(c, i) in profile.certificates"
            :key="i"
            class="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-3xl border-4 border-white shadow-sm items-center"
          >
            <div
              class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl shrink-0"
            >
              📜
            </div>
            <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <input
                v-model="c.title"
                placeholder="Название диплома / сертификата"
                class="bg-slate-50/50 px-4 py-2 rounded-lg font-black text-xs outline-none"
              />
              <input
                v-model="c.issuer"
                placeholder="Кем выдан"
                class="bg-slate-50/50 px-4 py-2 rounded-lg font-bold text-[10px] outline-none"
              />
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <button
                @click="triggerCertUpload(i)"
                class="p-3 bg-brand-blue/10 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white transition-all"
                :title="c.url ? 'Заменить PDF' : 'Загрузить PDF'"
              >
                {{ c.url ? '📎' : '📤' }}
              </button>
              <button
                @click="profile.certificates.splice(i, 1)"
                class="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
          </div>
          <button
            @click="addCert"
            class="w-full py-4 border-4 border-dashed border-slate-200 rounded-2xl font-black text-[10px] text-slate-400 uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all bg-white/50"
          >
            + Добавить достижение
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import { useTeacherApi } from '@entities/teacher/api'
import type { TeacherProfile } from '@entities/teacher/model/types'
import { useUploadApi } from '@shared/api/upload'
import { useToast } from '@shared/composables/useToast'

const teacherApi = useTeacherApi()
const uploadApi = useUploadApi()
const toast = useToast()
const isSaving = ref(false)
const isUploading = ref(false)
const activeSubTab = ref('basic')

const videoFileInput = ref<HTMLInputElement | null>(null)
const certFileInput = ref<HTMLInputElement | null>(null)
const activeCertIndex = ref<number | null>(null)

const subTabs = [
  { id: 'basic', label: 'О себе' },
  { id: 'career', label: 'Карьера' },
  { id: 'media', label: 'Медиа' },
  { id: 'docs', label: 'Дипломы' },
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
  socialLinks: { linkedin: '', github: '', telegram: '', website: '' },
})

onMounted(async () => {
  try {
    const data = await teacherApi.getProfile()
    Object.assign(profile, data)
    profile.certificates = profile.certificates || []
  } catch {
    toast.error('Ошибка загрузки профиля')
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

const addCert = () => {
  if (!profile.certificates) profile.certificates = []
  profile.certificates.push({ title: '', issuer: '', year: '', url: '' })
}

const triggerCertUpload = (index: number) => {
  activeCertIndex.value = index
  certFileInput.value?.click()
}

const handleCertUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || activeCertIndex.value === null) return

  isUploading.value = true
  try {
    const { url } = await uploadApi.uploadFile(file)
    if (profile.certificates?.[activeCertIndex.value]) {
      profile.certificates[activeCertIndex.value].url = url
    }
    toast.success('Диплом загружен! 📜')
  } catch (err) {
    toast.error('Ошибка загрузки')
  } finally {
    isUploading.value = false
    activeCertIndex.value = null
  }
}

const handleVideoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isUploading.value = true
  try {
    const { url } = await uploadApi.uploadVideo(file)
    profile.videoUrl = url
    toast.success('Видео загружено! 🎬')
  } catch (err) {
    toast.error('Ошибка загрузки видео')
  } finally {
    isUploading.value = false
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    const payload = JSON.parse(JSON.stringify(profile))
    delete payload.id
    delete payload.userId
    await teacherApi.updateProfile(payload)
    toast.success('Профиль мастера сохранен! 🚀')
  } catch (err) {
    toast.error('Ошибка сохранения')
  } finally {
    isSaving.value = false
  }
}

const config = useRuntimeConfig()

const formatFileUrl = (path?: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  try {
    const url = new URL(config.public.apiBase)
    return `${url.origin}${path.startsWith('/') ? '' : '/'}${path}`
  } catch (_e) {
    return path
  }
}

const isLocalVideo = computed(() => {
  return profile.videoUrl?.includes('/upload/stream')
})
</script>

<style scoped>
.shadow-cartoon-sm {
  box-shadow: 0 4px 0 0 #166534;
}
</style>
