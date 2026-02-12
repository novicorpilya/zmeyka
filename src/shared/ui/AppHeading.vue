<template>
  <component
    :is="level"
    :class="[
      'font-black text-slate-800 tracking-tight leading-tight',
      size === 'xs' ? 'text-sm uppercase tracking-widest text-slate-400' : '',
      size === 'sm' ? 'text-lg md:text-xl' : '',
      size === 'md' ? 'text-2xl md:text-3xl' : '',
      size === 'lg' ? 'text-3xl md:text-4xl' : '',
      size === 'xl' ? 'text-4xl md:text-6xl' : '',
      center ? 'text-center' : '',
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
}

withDefaults(defineProps<Props>(), {
  level: 'h2',
  size: 'md',
  center: false,
})
</script>
