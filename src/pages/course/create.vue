<template>
  <div class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <NuxtLink to="/" class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            ← Back to Home
          </NuxtLink>
          <h1 class="text-3xl font-bold mt-2 text-slate-100">Course Builder</h1>
          <p class="text-slate-400">Create a new high-quality AI course for your students.</p>
        </div>
      </div>

      <CourseForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import CourseForm from '@/features/course-builder/ui/CourseForm.vue'
</script>
