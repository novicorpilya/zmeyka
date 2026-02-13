<template>
  <div class="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Teacher Header Stats -->
    <TeacherStatsGrid :stats="teacherStore.stats" />

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
      <!-- Left Column: Tasks & Actions -->
      <div class="xl:col-span-8 space-y-8 md:space-y-10">
        <!-- Action Card -->
        <TeacherActionCard />

        <!-- Grading Queue -->
        <TeacherGradingQueue
          :homeworks="teacherStore.recentHomeworks"
          :pending-count="teacherStore.stats.pendingHomeworks"
        />
      </div>

      <!-- Right Column: My Students -->
      <aside class="xl:col-span-4 space-y-8 md:space-y-10">
        <TeacherStudentsList :students="teacherStore.students" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTeacherStore } from '@entities/teacher/model/store'
import TeacherActionCard from '@widgets/teacher-dashboard/ui/TeacherActionCard.vue'
import TeacherGradingQueue from '@widgets/teacher-dashboard/ui/TeacherGradingQueue.vue'
import TeacherStatsGrid from '@widgets/teacher-dashboard/ui/TeacherStatsGrid.vue'
import TeacherStudentsList from '@widgets/teacher-dashboard/ui/TeacherStudentsList.vue'

const teacherStore = useTeacherStore()
</script>
