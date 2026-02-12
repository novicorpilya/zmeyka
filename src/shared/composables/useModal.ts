import { ref } from 'vue'

export type ModalType = 'confirm' | 'prompt' | 'info' | 'preview'

export interface ModalOptions {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  placeholder?: string
  initialValue?: string
  type?: ModalType
  url?: string
}

export interface ModalState extends ModalOptions {
  id: number
  resolve: (value: unknown) => void
}

const modals = ref<ModalState[]>([])
let counter = 0

export const useModal = () => {
  const show = (options: ModalOptions): Promise<unknown> => {
    return new Promise((resolve) => {
      const id = ++counter
      modals.value.push({
        id,
        ...options,
        type: options.type || 'info',
        confirmText: options.confirmText || 'ОК',
        cancelText: options.cancelText || 'Отмена',
        resolve,
      })
    })
  }

  const confirm = (title: string, message?: string): Promise<boolean> => {
    return show({
      title,
      message,
      type: 'confirm',
      confirmText: 'Да, удалить',
      cancelText: 'Нет, оставить',
    }) as Promise<boolean>
  }

  const prompt = (
    title: string,
    placeholder?: string,
    initialValue = '',
  ): Promise<string | false> => {
    return show({
      title,
      placeholder,
      initialValue,
      type: 'prompt',
      confirmText: 'Создать',
      cancelText: 'Отмена',
    }) as Promise<string | false>
  }

  const close = (id: number, value: unknown): void => {
    const index = modals.value.findIndex((m) => m.id === id)
    if (index !== -1) {
      const modal = modals.value[index]
      modals.value.splice(index, 1)
      modal.resolve(value)
    }
  }

  return {
    modals,
    show,
    confirm,
    prompt,
    close,
  }
}
