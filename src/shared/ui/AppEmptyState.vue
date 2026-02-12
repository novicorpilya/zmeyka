<template>
  <div
    class="text-center py-16 md:py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 space-y-6 px-6"
  >
    <div v-if="icon" class="text-6xl">{{ icon }}</div>
    <AppHeading v-if="title" size="md">{{ title }}</AppHeading>
    <p v-if="description" class="text-slate-400 font-bold max-w-md mx-auto">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppHeading from './AppHeading.vue'

interface Props {
  icon?: string
  title?: string
  description?: string
}

defineProps<Props>()
</script>
