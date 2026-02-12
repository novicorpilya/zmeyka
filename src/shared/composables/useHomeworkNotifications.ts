import type { Ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

import type { Socket } from '../types'

import { useToast } from './useToast'

interface UseHomeworkNotificationsOptions {
  isTeacher: boolean
  onRefreshTeacher?: () => void
  onRefreshStudent?: () => void
}

interface NuxtAppWithSocket {
  $socket: Ref<Socket | null>
}

export const useHomeworkNotifications = (options: UseHomeworkNotificationsOptions) => {
  const nuxtApp = useNuxtApp() as unknown as NuxtAppWithSocket
  const toast = useToast()

  onMounted(() => {
    const socket = nuxtApp.$socket.value
    if (socket) {
      // Teacher: Auto-refresh when someone submits homework
      if (options.isTeacher) {
        socket.on('homework_submitted', (data: unknown) => {
          const socketData = data as { studentName: string }
          toast.info(`Новая работа от ${socketData.studentName}! 🚀`)
          options.onRefreshTeacher?.()
        })
      }

      // Refresh on general updates
      socket.on('new_comment', () => {
        if (options.isTeacher) {
          options.onRefreshTeacher?.()
        } else {
          options.onRefreshStudent?.()
        }
      })
    }
  })

  onUnmounted(() => {
    const socket = nuxtApp.$socket.value
    if (socket) {
      socket.off('homework_submitted')
      socket.off('new_comment')
    }
  })
}
