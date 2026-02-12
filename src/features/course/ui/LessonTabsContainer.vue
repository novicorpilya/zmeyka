<template>
  <div
    class="bg-white rounded-[3rem] border-4 border-slate-100 shadow-cartoon overflow-hidden transition-all"
  >
    <div class="flex border-b-4 border-slate-50">
      <button
        v-for="tab in ['Материалы', 'Практика', 'Обсуждение']"
        :key="tab"
        @click="$emit('update:modelValue', tab)"
        class="flex-grow py-6 font-black text-sm uppercase tracking-widest transition-all relative"
        :class="modelValue === tab ? 'text-brand-blue' : 'text-slate-400 hover:bg-slate-50'"
      >
        {{ tab }}
        <div
          v-if="modelValue === tab"
          class="absolute bottom-0 left-0 right-0 h-1.5 bg-brand-blue"
        ></div>
      </button>
    </div>

    <div class="p-8 md:p-12 min-h-[400px]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 12px 0 0 #f1f5f9;
}
</style>
