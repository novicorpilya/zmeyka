import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
}

const toasts = ref<Toast[]>([])
let counter = 0

export const useToast = () => {
  const show = (
    message: string,
    options: {
      type?: ToastType
      duration?: number
      action?: { label: string; handler: () => void }
    } = {},
  ): number => {
    const id = ++counter
    const { type = 'info', duration = 4000, action } = options
    const toast: Toast = { id, message, type, duration, action }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const success = (message: string, duration?: number, action?: Toast['action']): number =>
    show(message, { type: 'success', duration, action })
  const error = (message: string, duration?: number, action?: Toast['action']): number =>
    show(message, { type: 'error', duration, action })
  const info = (message: string, duration?: number, action?: Toast['action']): number =>
    show(message, { type: 'info', duration, action })
  const warning = (message: string, duration?: number, action?: Toast['action']): number =>
    show(message, { type: 'warning', duration, action })

  const remove = (id: number): void => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    remove,
  }
}
