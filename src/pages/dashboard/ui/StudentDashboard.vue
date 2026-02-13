<template>
  <div class="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Welcome Section -->
    <StudentWelcomeCard :name="userStore.user?.name" :streak="dashboardStore.stats.streak" />

    <!-- Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
      <div class="xl:col-span-8 space-y-8 md:space-y-10">
        <!-- Courses -->
        <StudentActiveCourses :courses="dashboardStore.activeCourses" />

        <!-- Stats -->
        <StudentStatsGrid :stats="dashboardStore.stats" />
      </div>

      <!-- Right Column -->
      <aside class="xl:col-span-4 space-y-8 md:space-y-10">
        <!-- Recent Homeworks -->
        <StudentRecentHomeworks :homeworks="dashboardStore.homeworks" />

        <div
          class="bg-brand-blue p-6 sm:p-8 rounded-[2.5rem] shadow-[0_10px_0_0_#1e40af] text-white space-y-6 relative overflow-hidden"
        >
          <h3 class="text-lg font-black uppercase tracking-tight">Мудрость дня</h3>
          <p class="font-bold leading-relaxed italic">
            "Функции — это как рецепты. Напиши один раз, а пеки сколько влезет!"
          </p>
        </div>

        <!-- Certificates (Awarded after full course completion) -->
        <CertificateDownload
          v-if="dashboardStore.stats.completedCourses > 0"
          :user-name="userStore.userName"
          course-name="Основы Python"
        />

        <!-- Recent Activity -->
        <StudentRecentActivity :activities="dashboardStore.recentActivity" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '@entities/dashboard/model/store'
import { useUserStore } from '@entities/user/model/store'
import CertificateDownload from '@features/certificate/ui/CertificateDownload.vue'
import StudentActiveCourses from '@widgets/student-dashboard/ui/StudentActiveCourses.vue'
import StudentRecentActivity from '@widgets/student-dashboard/ui/StudentRecentActivity.vue'
import StudentRecentHomeworks from '@widgets/student-dashboard/ui/StudentRecentHomeworks.vue'
import StudentStatsGrid from '@widgets/student-dashboard/ui/StudentStatsGrid.vue'
import StudentWelcomeCard from '@widgets/student-dashboard/ui/StudentWelcomeCard.vue'

const userStore = useUserStore()
const dashboardStore = useDashboardStore()
</script>
