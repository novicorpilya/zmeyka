<template>
  <div class="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Teacher Header Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div
        v-for="stat in summaryStats"
        :key="stat.label"
        class="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-cartoon-sm flex flex-col items-center text-center group hover:border-brand-blue transition-all"
      >
        <div
          class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
        >
          {{ stat.icon }}
        </div>
        <div class="text-3xl font-black text-slate-800">{{ stat.value }}</div>
        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
          {{ stat.label }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
      <!-- Left Column: Tasks & Actions -->
      <div class="xl:col-span-8 space-y-8 md:space-y-10">
        <!-- Action Card -->
        <section
          class="bg-brand-blue p-8 rounded-[3rem] shadow-[0_12px_0_0_#1e40af] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div class="space-y-4 relative z-10 text-center md:text-left">
            <h2 class="text-3xl font-black leading-tight">
              Создай новое <br />
              IT-приключение!
            </h2>
            <p class="font-bold text-white/80">
              Твои знания — это суперсила. Поделись ими со студентами через интерактивные уроки.
            </p>
            <NuxtLink
              to="/courses/create"
              class="inline-flex items-center gap-3 bg-brand-yellow text-slate-900 px-8 py-4 rounded-2xl font-black shadow-[0_6px_0_0_#ca8a04] hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Создать курс 🛠️
            </NuxtLink>
          </div>
          <div class="w-48 h-48 relative z-10 shrink-0">
            <span class="text-[120px] filter drop-shadow-lg">✨</span>
          </div>
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        <!-- Grading Queue -->
        <section
          class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8"
        >
          <div class="flex items-center justify-between">
            <h3
              class="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3"
            >
              📝 Очередь проверки
              <span
                v-if="teacherStore.stats.pendingHomeworks > 0"
                class="bg-brand-orange text-white text-[10px] px-2 py-1 rounded-lg animate-pulse"
              >
                {{ teacherStore.stats.pendingHomeworks }} NEW
              </span>
            </h3>
          </div>

          <div v-if="teacherStore?.recentHomeworks?.length" class="space-y-4">
            <div
              v-for="hw in teacherStore.recentHomeworks"
              :key="hw.id"
              class="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-brand-green transition-all group cursor-pointer"
            >
              <div
                class="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-xl shrink-0"
              >
                👤
              </div>
              <div class="flex-grow min-w-0">
                <p class="font-black text-slate-800 truncate">{{ hw.studentName }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {{ hw.courseTitle }}
                </p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[10px] font-black text-slate-400 capitalize mb-1">
                  {{ formatDate(hw.submittedAt) }}
                </p>
                <NuxtLink
                  :to="`/homework/${hw.id}`"
                  class="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-black text-[10px] text-brand-green hover:bg-brand-green hover:text-white hover:border-brand-green transition-all inline-block"
                >
                  ПРОВЕРИТЬ
                </NuxtLink>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 text-slate-400 font-bold">
            В очереди пусто! Можно отдохнуть или создать новый урок 🌴
          </div>
        </section>
      </div>

      <!-- Right Column: My Students -->
      <aside class="xl:col-span-4 space-y-8 md:space-y-10">
        <section
          class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8"
        >
          <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Мои ученики</h3>
          <div class="space-y-6">
            <div
              v-for="student in teacherStore?.students"
              :key="student.id"
              class="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group"
            >
              <div
                class="w-12 h-12 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform"
              >
                {{ student.avatar || '🐍' }}
              </div>
              <div class="min-w-0 flex-grow">
                <p class="font-black text-slate-800 text-sm truncate uppercase tracking-tight">
                  {{ student.name }}
                </p>
                <p class="text-[10px] font-bold text-slate-400 truncate">{{ student.email }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black text-brand-blue uppercase tracking-widest">
                  {{ student.homeworksCount }} ДЗ
                </p>
              </div>
            </div>

            <div
              v-if="!teacherStore?.students?.length"
              class="text-center py-8 text-slate-400 font-bold"
            >
              Учеников пока нет... 😢
            </div>
          </div>
          <NuxtLink
            to="/courses"
            class="block text-center text-[10px] font-black text-slate-400 hover:text-brand-blue uppercase tracking-widest transition-colors pt-4 border-t-2 border-slate-50"
          >
            Перейти в мастерскую курсов →
          </NuxtLink>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTeacherStore } from '~/entities/teacher/model/store'

const teacherStore = useTeacherStore()

const summaryStats = computed(() => [
  { label: 'Курсов', value: teacherStore.stats.totalCourses, icon: '🎓' },
  { label: 'Студентов', value: teacherStore.stats.totalStudents, icon: '👥' },
  { label: 'Проверить', value: teacherStore.stats.pendingHomeworks, icon: '⚖️' },
  { label: 'Активных', value: teacherStore.stats.activeToday, icon: '🔥' },
])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
.shadow-cartoon-sm {
  box-shadow: 0 6px 0 0 #f1f5f9;
}
</style>
