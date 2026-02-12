import { defineStore } from 'pinia'

import { useApi } from '~/shared/api'

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
  let eventSource: EventSource | null = null

  const fetchRecent = async () => {
    try {
      const data = await api<Notification[]>('/notifications/recent')
      notifications.value = data
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }

  const connectSSE = () => {
    if (import.meta.server) return
    if (eventSource) eventSource.close()

    const config = useRuntimeConfig()
    useCookie<string | null>('access_token')

    // SSE doesn't support custom headers easily, so we use a query param or just rely on cookies if possible
    // But our backend expects Bearer token. We'll use a trick or just simple polling if SSE is too complex for this setup.
    // Let's try SSE with cookie-based auth or a token in URL if backend allows.
    // For now, let's implement the connection.

    const url = new URL(`${config.public.apiBase}/notifications/sse`)
    // If backend supports token in query: url.searchParams.set('token', at.value || '')

    eventSource = new EventSource(url.toString(), { withCredentials: true })

    eventSource.onopen = () => {
      isConnected.value = true
      console.log('SSE Connected')
    }

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data) as Notification
        // Add to list and play sound or show toast
        notifications.value.unshift(notification)
        if (notifications.value.length > 50) notifications.value.pop()
      } catch (err) {
        console.error('SSE Message error', err)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE Error', err)
      isConnected.value = false
      eventSource?.close()
      // Retry after 5s
      setTimeout(connectSSE, 5000)
    }
  }

  const markRead = async (id: string) => {
    try {
      await api(`/notifications/mark-read/${id}`, { method: 'POST' })
      const n = notifications.value.find((n) => n.id === id)
      if (n) n.read = true
    } catch (err) {
      console.error('Failed to mark notification as read', err)
    }
  }

  const markAllRead = async () => {
    try {
      await api('/notifications/mark-all-read', { method: 'POST' })
      notifications.value.forEach((n) => (n.read = true))
    } catch (err) {
      console.error('Failed to mark all notifications as read', err)
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
