<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-white p-8 rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon flex flex-col items-center text-center group"
    >
      <div
        class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform"
      >
        {{ stat.icon }}
      </div>
      <div class="text-3xl font-black text-slate-800">{{ stat.value }}</div>
      <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stat {
  label: string
  value: string | number
  icon: string
}

defineProps<{
  stats: Stat[]
}>()
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
</style>
