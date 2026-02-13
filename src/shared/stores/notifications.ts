import { defineStore } from 'pinia'

import { useApi } from '@shared/api'

export interface Notification {
  id: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ASSIGNMENT' | 'COMMENT'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

export const useNotificationStore = defineStore('notification', () => {
  const api = useApi()
  const notifications = ref<Notification[]>([])
  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  let eventSource: EventSource | null = null
  let retryTimer: any = null

  const fetchRecent = async () => {
    try {
      const data = await api<Notification[]>('/notifications/recent')
      notifications.value = data
    } catch {
      // Silent fail
    }
  }

  const connectSSE = () => {
    if (import.meta.server) return
    if (eventSource || isConnecting.value) return

    const config = useRuntimeConfig()
    const accessToken = useCookie<string | null>('access_token')

    if (!accessToken.value) {
      // Retry connection later
      if (retryTimer) clearTimeout(retryTimer)
      retryTimer = setTimeout(connectSSE, 10000)
      return
    }

    isConnecting.value = true
    if (retryTimer) clearTimeout(retryTimer)

    // Append token to query params (since EventSource doesn't support headers)
    const base = config.public.apiBase as string
    const url = new URL(`${base.endsWith('/') ? base.slice(0, -1) : base}/notifications/sse`)
    url.searchParams.set('token', accessToken.value)

    eventSource = new EventSource(url.toString(), { withCredentials: true })

    eventSource.onopen = () => {
      isConnected.value = true
      isConnecting.value = false
    }

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const notification = JSON.parse(event.data) as Notification
        notifications.value.unshift(notification)
        if (notifications.value.length > 50) notifications.value.pop()
      } catch {
        // failed parse
      }
    }

    eventSource.onerror = () => {
      isConnected.value = false
      isConnecting.value = false

      if (eventSource) {
        eventSource.close()
        eventSource = null
      }

      if (retryTimer) clearTimeout(retryTimer)
      retryTimer = setTimeout(connectSSE, 5000)
    }
  }

  const markRead = async (id: string) => {
    try {
      await api(`/notifications/mark-read/${id}`, { method: 'POST' })
      const n = notifications.value.find((n) => n.id === id)
      if (n) n.read = true
    } catch {
      // Silent fail
    }
  }

  const markAllRead = async () => {
    try {
      await api('/notifications/mark-all-read', { method: 'POST' })
      notifications.value.forEach((n) => (n.read = true))
    } catch {
      // Silent fail
    }
  }

  return {
    notifications,
    unreadCount,
    isConnected,
    fetchRecent,
    connectSSE,
    markRead,
    markAllRead,
  }
})
