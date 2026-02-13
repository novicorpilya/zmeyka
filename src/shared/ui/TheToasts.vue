<template>
  <div
    class="fixed top-6 right-6 z-[9999] flex flex-col gap-4 w-full max-w-[400px] pointer-events-none"
  >
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3 items-end">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto group relative flex items-center gap-4 bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-white transition-all hover:scale-[1.02]"
        :class="getTypeStyles(toast.type)"
      >
        <!-- Icon -->
        <div
          class="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm"
          :class="getIconBg(toast.type)"
        >
          {{ getIcon(toast.type) }}
        </div>

        <!-- content -->
        <div class="flex-grow flex items-center justify-between gap-4">
          <p class="text-xs font-black text-slate-800 leading-tight">
            {{ toast.message }}
          </p>

          <button
            v-if="toast.action"
            @click.stop="handleToastAction(toast)"
            class="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            {{ toast.action.label }}
          </button>
        </div>

        <!-- Close button -->
        <button
          @click="remove(toast.id)"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all text-lg"
        >
          ×
        </button>

        <!-- Progress Bar (Auto-hide indicator) -->
        <div
          v-if="toast.duration"
          class="absolute bottom-0 left-6 right-6 h-1 bg-slate-100 rounded-full overflow-hidden"
        >
          <div
            class="h-full transition-all linear"
            :class="getBarColor(toast.type)"
            :style="{
              animationName: 'toast-progress',
              animationDuration: toast.duration + 'ms',
              animationTimingFunction: 'linear',
            }"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '@shared/composables/useToast'

const { toasts, remove } = useToast()

const handleToastAction = (toast: { id: number; action?: { handler: () => void } }) => {
  if (toast.action) {
    toast.action.handler()
  }
  remove(toast.id)
}

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    default:
      return 'ℹ️'
  }
}

const getIconBg = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-brand-green/20'
    case 'error':
      return 'bg-red-100'
    case 'warning':
      return 'bg-amber-100'
    default:
      return 'bg-brand-blue/10'
  }
}

const getTypeStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'hover:border-brand-green/20'
    case 'error':
      return 'hover:border-red-200'
    case 'warning':
      return 'hover:border-amber-200'
    default:
      return 'hover:border-brand-blue/20'
  }
}

const getBarColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-brand-green'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-amber-500'
    default:
      return 'bg-brand-blue'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.5);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30%) scale(0.9);
}

/* Ensure moving items transition smoothly */
.toast-move {
  transition: transform 0.5s ease;
}

@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
