<template>
  <div
    :class="[
      'bg-white transition-all',
      interactive ? 'hover:border-brand-blue hover:-translate-y-1' : '',
      variant === 'cartoon'
        ? 'rounded-[2rem] md:rounded-[2.5rem] border-4 border-slate-100 shadow-cartoon'
        : '',
      variant === 'glass' ? 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl' : '',
      variant === 'outlined' ? 'rounded-2xl border-2 border-slate-100 shadow-sm' : '',
      padding === 'none' ? 'p-0' : '',
      padding === 'sm' ? 'p-4 md:p-6' : '',
      padding === 'md' ? 'p-6 md:p-8' : '',
      padding === 'lg' ? 'p-8 md:p-12' : '',
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  /**
   * Visual theme of the card
   * @default 'cartoon'
   */
  variant?: 'cartoon' | 'glass' | 'outlined'
  /**
   * Internal spacing/padding
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Whether the card should have hover effects and cursor pointer
   * @default false
   */
  interactive?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'cartoon',
  padding: 'md',
  interactive: false,
})
</script>
