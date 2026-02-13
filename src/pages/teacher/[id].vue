<template>
  <div class="space-y-12 animate-in fade-in duration-1000 pb-20">
    <div v-if="pending" class="h-96 flex items-center justify-center">
      <div class="text-6xl animate-bounce">🎨</div>
    </div>

    <template v-else-if="profile">
      <!-- Hero Header -->
      <section class="relative">
        <div
          class="h-64 md:h-80 bg-slate-900 rounded-[3rem] md:rounded-[4rem] overflow-hidden relative border-8 border-white shadow-cartoon"
        >
          <div
            class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-shimmer"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"
          ></div>
        </div>

        <div class="max-w-6xl mx-auto px-6 md:px-12 -mt-24 md:-mt-32 relative z-10">
          <div class="flex flex-col md:flex-row items-end gap-8">
            <div
              class="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] md:rounded-[3.5rem] border-8 border-white bg-slate-100 shadow-cartoon overflow-hidden shrink-0"
            >
              <img v-if="profile.avatar" :src="profile.avatar" class="w-full h-full object-cover" />
              <span v-else class="text-7xl flex items-center justify-center h-full">👨‍🏫</span>
            </div>
            <div class="flex-grow pb-4 space-y-2">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="sub in profile.subjects"
                  :key="sub"
                  class="px-4 py-1.5 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
                >
                  {{ sub }}
                </span>
              </div>
              <h1
                class="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-lg"
              >
                {{ profile.name || 'Мастер Знаний' }}
              </h1>
              <p class="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                {{ profile.workplace || 'Эксперт индустрии' }} • {{ profile.experience || 0 }} лет в
                деле
              </p>
            </div>
            <div class="pb-4 hidden lg:flex gap-4">
              <a
                v-for="(url, key) in profile.socialLinks"
                :key="key"
                :href="url"
                target="_blank"
                class="w-12 h-12 bg-white rounded-2xl shadow-cartoon-sm flex items-center justify-center hover:-translate-y-1 transition-all"
              >
                <span class="text-xl">{{ getSocialIcon(key) }}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div class="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <!-- Left Column: Info -->
        <div class="lg:col-span-7 space-y-12">
          <!-- Bio -->
          <div class="space-y-6">
            <h2 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              Путь мастера <span class="text-brand-yellow">✨</span>
            </h2>
            <div
              class="p-8 md:p-10 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-slate-100 shadow-cartoon leading-relaxed font-bold text-slate-500 whitespace-pre-line text-lg"
            >
              {{ profile.bio || 'Этот мастер предпочитает, чтобы его дела говорили громче слов.' }}
            </div>
          </div>

          <!-- Video -->
          <div v-if="profile.videoUrl" class="space-y-6">
            <h2 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              Визитка <span class="text-brand-green">🎬</span>
            </h2>
            <div
              class="aspect-video bg-slate-900 rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden group"
            >
              <video
                v-if="isLocalVideo"
                :src="profile.videoUrl"
                controls
                class="w-full h-full object-cover"
              ></video>
              <iframe
                v-else
                :src="getEmbedUrl(profile.videoUrl)"
                class="w-full h-full"
                frameborder="0"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                "
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <!-- Career & Education -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              class="p-8 bg-brand-green/5 border-4 border-brand-green/10 rounded-[2.5rem] space-y-4"
            >
              <div class="text-3xl">🏛️</div>
              <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs">
                Образование
              </h3>
              <p class="font-bold text-slate-500 text-sm leading-snug">
                {{ profile.education || 'Самоучка / Нет данных' }}
              </p>
            </div>
            <div
              class="p-8 bg-brand-blue/5 border-4 border-brand-blue/10 rounded-[2.5rem] space-y-4"
            >
              <div class="text-3xl">💼</div>
              <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs">
                Преподает в
              </h3>
              <p class="font-bold text-slate-500 text-sm leading-snug">
                {{ profile.institution || 'Частная практика' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column: Courses & Docs -->
        <div class="lg:col-span-5 space-y-12">
          <!-- Courses -->
          <div class="space-y-6">
            <h2 class="text-3xl font-black text-slate-800 tracking-tight">
              Курсы <span class="text-brand-blue">📚</span>
            </h2>
            <div v-if="courses?.length" class="space-y-4">
              <NuxtLink
                v-for="course in courses"
                :key="course.id"
                :to="`/courses/${course.id}`"
                class="block p-6 bg-white rounded-[2rem] border-4 border-slate-100 shadow-sm hover:border-brand-blue hover:-translate-y-1 transition-all group"
              >
                <div class="flex gap-4">
                  <div
                    class="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                  >
                    {{ course.category === 'Python' ? '🐍' : '📚' }}
                  </div>
                  <div class="flex-grow space-y-2">
                    <h4
                      class="font-black text-slate-800 line-clamp-1 italic uppercase tracking-tighter"
                    >
                      {{ course.title }}
                    </h4>
                    <div class="flex items-center gap-3 text-[9px] font-black text-slate-400">
                      <span>🎓 {{ course.plannedLessonsCount }} Уроков</span>
                      <span class="text-brand-orange">🔥 {{ course.studentsCount }} учеников</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
            <div
              v-else
              class="p-10 text-center border-4 border-dashed border-slate-100 rounded-[2rem] text-slate-300 font-bold uppercase tracking-widest text-xs"
            >
              Пока нет активных курсов
            </div>
          </div>

          <!-- Certificates -->
          <div v-if="profile.certificates?.length" class="space-y-6">
            <h2 class="text-3xl font-black text-slate-800 tracking-tight">
              Сертификаты <span class="text-red-400">📜</span>
            </h2>
            <div class="space-y-4">
              <div
                v-for="(cert, idx) in profile.certificates"
                :key="idx"
                class="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 flex flex-col gap-4"
              >
                <div class="flex items-center gap-4">
                  <div class="text-2xl">🏆</div>
                  <div class="flex-grow">
                    <p class="font-black text-slate-800 text-xs uppercase tracking-tight">
                      {{ cert.title }}
                    </p>
                    <p class="font-bold text-slate-400 text-[10px] uppercase">
                      {{ cert.issuer }}, {{ cert.year }}
                    </p>
                  </div>
                </div>
                <a
                  v-if="cert.url"
                  :target="'_blank'"
                  :href="formatFileUrl(cert.url)"
                  class="w-full py-2 bg-white border-2 border-slate-100 rounded-xl text-center text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all"
                >
                  Посмотреть PDF 📄
                </a>
              </div>
            </div>
          </div>

          <!-- Mobile Socials -->
          <div class="lg:hidden flex justify-center gap-4">
            <a
              v-for="(url, key) in profile.socialLinks"
              :key="key"
              :href="url"
              target="_blank"
              class="w-14 h-14 bg-white rounded-2xl shadow-cartoon flex items-center justify-center"
            >
              <span class="text-2xl">{{ getSocialIcon(key) }}</span>
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCourseApi } from '@entities/course/api'
import { useTeacherApi } from '@entities/teacher/api'

definePageMeta({
  layout: 'main',
})

const route = useRoute()
const teacherApi = useTeacherApi()
const courseApi = useCourseApi()

const { data: profile, pending } = useAsyncData('teacher-public-profile', () =>
  teacherApi.getPublicProfile(route.params.id as string),
)

const { data: courses } = useAsyncData('teacher-courses', () =>
  courseApi.getCoursesByTeacher(route.params.id as string),
)

const isLocalVideo = computed(() => {
  return profile.value?.videoUrl?.includes('/upload/stream')
})

const getSocialIcon = (key: string) => {
  const icons: Record<string, string> = {
    linkedin: '🔗',
    github: '💻',
    telegram: '✈️',
    website: '🌐',
  }
  return icons[key] || '🔗'
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

const getEmbedUrl = (url: string) => {
  if (!url) return ''
  // Basic YouTube conversion
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/')
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('/').pop()
    return `https://www.youtube.com/embed/${id}`
  }
  return url
}
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
.shadow-cartoon-sm {
  box-shadow: 0 4px 0 0 #f1f5f9;
}
.animate-shimmer {
  animation: shimmer 15s linear infinite;
}
@keyframes shimmer {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 100%;
  }
}
</style>
