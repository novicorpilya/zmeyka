<template>
  <button
    v-bind="$attrs"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100',
      size === 'sm' ? 'px-4 py-2 text-[10px] rounded-lg' : '',
      size === 'md' ? 'px-6 py-3.5 text-xs rounded-xl' : '',
      size === 'lg' ? 'px-10 py-5 text-sm rounded-2xl' : '',
      variant === 'primary'
        ? 'bg-brand-green text-white shadow-[0_6px_0_0_#166534] hover:shadow-[0_4px_0_0_#166534] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none'
        : '',
      variant === 'secondary'
        ? 'bg-brand-blue text-white shadow-[0_6px_0_0_#1e40af] hover:shadow-[0_4px_0_0_#1e40af] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none'
        : '',
      variant === 'outline'
        ? 'bg-white text-slate-400 border-2 border-slate-50 hover:border-slate-200'
        : '',
      variant === 'danger'
        ? 'bg-red-500 text-white shadow-[0_6px_0_0_#991b1b] hover:shadow-[0_4px_0_0_#991b1b] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none'
        : '',
    ]"
  >
    <span
      v-if="loading"
      class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
    ></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

interface Props {
  /**
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  /**
   * Button size from small to large
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Loading state (shows spinner and disables button)
   * @default false
   */
  loading?: boolean
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
})
</script>
