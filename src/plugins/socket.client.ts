import { io, Socket } from 'socket.io-client'
import { ref, watch } from 'vue'

import { useUserStore } from '@entities/user/model/store'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const socketRef = ref<Socket | null>(null)

  const connect = () => {
    if (socketRef.value?.connected) return

    const token = useCookie<string | null>('access_token').value
    if (!token) return

    // Adjust URL to your backend (strip /api suffix)
    const apiBase = (config.public.apiBase as string) || 'http://localhost:3001'
    const socketUrl = apiBase.replace(/\/api$/, '')

    const socket = io(socketUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      // WebSocket Connected
    })

    socket.on('disconnect', () => {
      // WebSocket Disconnected
    })

    socket.on('homework_reviewed', (_data: unknown) => {
      const { $toast } = nuxtApp as unknown as {
        $toast: { success: (m: string) => void; info: (m: string) => void }
      }
      $toast.success('Твоя домашняя работа проверена! 🎉')
    })

    // Global listener for notifications
    socket.on('new_comment', (data: { authorName?: string }) => {
      const { $toast } = nuxtApp as unknown as {
        $toast: { success: (m: string) => void; info: (m: string) => void }
      }
      $toast.info(`Новое сообщение от ${data.authorName || 'преподавателя'}`)
    })

    socketRef.value = socket
  }

  // Connect if authenticated
  if (userStore.isAuthenticated) {
    connect()
  }

  // Watch for auth changes
  watch(
    () => userStore.isAuthenticated,
    (val) => {
      if (val) connect()
      else {
        socketRef.value?.disconnect()
        socketRef.value = null
      }
    },
  )

  return {
    provide: {
      socket: socketRef,
    },
  }
})
