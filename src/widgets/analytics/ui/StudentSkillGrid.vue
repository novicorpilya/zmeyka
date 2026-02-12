<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
    <div
      v-for="skill in skills"
      :key="skill.name"
      class="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon flex flex-col items-center text-center space-y-4 md:space-y-6 group hover:translate-y-[-4px] transition-all"
    >
      <div
        class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 md:border-8 p-2 transition-all"
        :class="skill.borderColor"
      >
        <div
          class="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-3xl md:text-5xl group-hover:scale-110 transition-transform"
        >
          {{ skill.icon }}
        </div>
      </div>
      <div class="space-y-1">
        <h3 class="text-xl md:text-2xl font-black text-slate-800">{{ skill.name }}</h3>
        <p class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
          {{ skill.level }}
        </p>
      </div>
      <div class="w-full h-2.5 md:h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full transition-all duration-1000"
          :class="skill.barColor"
          :style="{ width: skill.progress + '%' }"
        ></div>
      </div>
      <p class="font-bold text-slate-500 text-[10px] md:text-sm">
        {{ skill.progress }}% до следующего уровня
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Skill {
  name: string
  level: string
  progress: number
  icon: string
  borderColor: string
  barColor: string
}

defineProps<{
  skills: Skill[]
}>()
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
</style>
