import { ref } from 'vue'

export interface CommandAction {
  id: string
  title: string
  subtitle?: string
  icon: string
  shortcut?: string[]
  handler: () => void
  category: 'content' | 'navigation' | 'system'
}

const isOpen = ref(false)
const actions = ref<CommandAction[]>([])

export const useCommandPalette = () => {
  const open = (): void => {
    isOpen.value = true
  }

  const close = (): void => {
    isOpen.value = false
  }

  const toggle = (): void => {
    isOpen.value = !isOpen.value
  }

  const registerActions = (newActions: CommandAction[]): void => {
    // Unique by ID to avoid duplicates during re-renders/hot reloads
    const existingIds = new Set(actions.value.map((a) => a.id))
    const uniqueNew = newActions.filter((a) => !existingIds.has(a.id))
    actions.value = [...actions.value, ...uniqueNew]
  }

  const clearActions = (): void => {
    actions.value = []
  }

  const removeAction = (id: string): void => {
    actions.value = actions.value.filter((a) => a.id !== id)
  }

  return {
    isOpen,
    actions,
    open,
    close,
    toggle,
    registerActions,
    clearActions,
    removeAction,
  }
}
