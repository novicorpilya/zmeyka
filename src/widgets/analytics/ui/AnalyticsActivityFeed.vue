<template>
  <div class="bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8">
    <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight shrink-0">
      {{ isTeacher ? 'Последние события' : 'Движ' }}
    </h3>
    <div class="space-y-6">
      <div v-for="(event, index) in events" :key="index" class="flex gap-4">
        <div class="w-2 h-2 rounded-full bg-brand-green mt-2 shrink-0"></div>
        <div>
          <p class="text-xs font-bold text-slate-500">{{ event.text }}</p>
          <p class="text-[10px] text-slate-300">{{ event.time }}</p>
        </div>
      </div>
      <div v-if="events.length === 0" class="text-center py-4 opacity-30">
        <p class="text-xs font-black uppercase tracking-widest">Пока тишина...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Event {
  text: string
  time: string
}

defineProps<{
  isTeacher: boolean
  events: Event[]
}>()
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
</style>
