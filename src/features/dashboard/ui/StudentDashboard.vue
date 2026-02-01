<template>
  <div class="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Welcome Section -->
    <section
      class="relative overflow-hidden bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border-4 border-slate-100 shadow-cartoon overflow-hidden group"
    >
      <div
        class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8"
      >
        <div class="space-y-4 text-center md:text-left order-2 md:order-1">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest"
          >
            🐍 Твой ИИ-наставник онлайн
          </div>
          <h1
            class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight"
          >
            С возвращением, <br class="sm:hidden" />
            <span class="text-brand-green">{{ userStore.user?.name || 'Ученик' }}</span
            >!
          </h1>
          <p class="text-base sm:text-lg font-bold text-slate-400 max-w-xl">
            Твоя змейка заждалась! Сегодня отличный день, чтобы освоить пару новых функций.
          </p>
          <div
            class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2"
          >
            <NuxtLink
              to="/courses"
              class="w-full sm:w-auto bg-brand-green px-8 py-4 rounded-2xl font-black text-white shadow-[0_6px_0_0_#166534] hover:translate-y-0.5 hover:shadow-[0_4px_0_0_#166534] transition-all flex items-center justify-center gap-3"
            >
              Учиться 🚀
            </NuxtLink>
            <div
              class="flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold text-slate-500 text-sm"
            >
              <span class="text-xl">🔥</span> 7 дней ударно
            </div>
          </div>
        </div>

        <div
          class="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 flex-shrink-0 order-1 md:order-2"
        >
          <div
            class="absolute inset-0 bg-brand-green/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          ></div>
          <img
            src="~/assets/logo.png"
            alt="Mascot"
            class="w-full h-full object-contain filter drop-shadow-2xl animate-float relative z-10"
          />
        </div>
      </div>
      <div
        class="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-slate-50/50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"
      ></div>
    </section>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
      <div class="xl:col-span-8 space-y-8 md:space-y-10">
        <!-- Courses -->
        <div class="space-y-6">
          <div class="flex items-center justify-between px-2">
            <h2
              class="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3"
            >
              📚 Обучение
            </h2>
            <NuxtLink
              to="/courses"
              class="text-xs sm:text-sm font-black text-brand-blue hover:underline uppercase tracking-wider"
              >Все →</NuxtLink
            >
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <template v-if="dashboardStore.activeCourses?.length">
              <div
                v-for="course in dashboardStore.activeCourses"
                :key="course.id"
                class="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon hover:border-brand-green transition-all group overflow-hidden relative"
              >
                <div class="space-y-5 sm:space-y-6 relative z-10">
                  <div class="flex items-start justify-between">
                    <div
                      class="w-12 h-12 sm:w-16 sm:h-16 bg-brand-blue/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform"
                    >
                      🐍
                    </div>
                  </div>
                  <div class="space-y-1">
                    <h3
                      class="text-xl sm:text-2xl font-black text-slate-800 line-clamp-1 leading-tight"
                    >
                      {{ course.title }}
                    </h3>
                    <p
                      class="font-bold text-slate-400 text-[10px] sm:text-sm line-clamp-1 italic italic"
                    >
                      с Мастером {{ course.teacherName }}
                    </p>
                  </div>
                  <div class="space-y-2.5">
                    <div
                      class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      <span>Прогресс</span>
                      <span class="text-brand-green">{{ course.progress }}%</span>
                    </div>
                    <div class="h-3 bg-slate-100 rounded-full p-0.5">
                      <div
                        class="h-full bg-brand-green rounded-full shadow-[0_0_8px_#22c55e] transition-all duration-1000"
                        :style="{ width: `${course.progress}%` }"
                      ></div>
                    </div>
                  </div>
                  <NuxtLink
                    :to="`/courses/${course.id}`"
                    class="w-full bg-slate-900 py-3.5 sm:py-4 rounded-xl font-black text-white text-xs sm:text-sm shadow-[0_5px_0_0_#1e293b] hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    Ворваться в урок
                  </NuxtLink>
                </div>
              </div>
            </template>
            <div
              v-else
              class="col-span-full p-8 sm:p-12 text-center bg-white rounded-[2rem] sm:rounded-[2.5rem] border-4 border-dashed border-slate-100 space-y-4"
            >
              <div class="text-4xl sm:text-5xl">🥚</div>
              <p class="text-lg sm:text-xl font-black text-slate-400">
                Тут пока пусто.. Давай вылупим твой первый курс!
              </p>
              <NuxtLink
                to="/courses"
                class="text-brand-green font-black underline decoration-2 underline-offset-4"
                >Каталог →</NuxtLink
              >
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          <div
            v-for="stat in displayStats"
            :key="stat.label"
            class="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-4 border-slate-100 shadow-sm flex flex-col items-center gap-1 sm:gap-2 group hover:translate-y-[-4px] transition-all"
          >
            <span class="text-2xl sm:text-3xl group-hover:scale-125 transition-transform">{{
              stat.icon
            }}</span>
            <div class="text-xl sm:text-2xl font-black text-slate-800">{{ stat.value }}</div>
            <div
              class="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center"
            >
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <aside class="xl:col-span-4 space-y-8 md:space-y-10">
        <div
          class="bg-brand-blue p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_10px_0_0_#1e40af] text-white space-y-6 relative overflow-hidden"
        >
          <h3 class="text-lg font-black uppercase tracking-tight">Мудрость дня</h3>
          <p class="font-bold leading-relaxed italic">
            "Функции — это как рецепты. Напиши один раз, а пеки сколько влезет!"
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '~/entities/dashboard/model/store'
import { useUserStore } from '~/entities/user/model/store'

const userStore = useUserStore()
const dashboardStore = useDashboardStore()

const displayStats = computed(() => [
  { label: 'Опыт', value: formatValue(dashboardStore.stats.xp), icon: '✨' },
  { label: 'Курсов', value: dashboardStore.stats.completedCourses, icon: '🎓' },
  { label: 'Модули', value: dashboardStore.stats.completedLessons, icon: '💎' },
  { label: 'Ударно', value: dashboardStore.stats.streak, icon: '🔥' },
])

const formatValue = (val: number) => {
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
  return val
}
</script>
