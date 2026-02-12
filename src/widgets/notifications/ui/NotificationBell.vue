<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- Bell Button -->
    <button
      @click="toggleDropdown"
      class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-slate-100 hover:translate-y-[-2px] hover:bg-slate-50 transition-all relative shrink-0 active:scale-95"
    >
      <span class="text-lg md:text-xl">🔔</span>
      <!-- Unread Badge -->
      <span
        v-if="store.unreadCount > 0"
        class="absolute top-1 right-1 w-4 h-4 bg-brand-orange border-2 border-white rounded-full flex items-center justify-center animate-bounce"
      >
        <span class="text-[8px] font-black text-white">{{ store.unreadCount }}</span>
      </span>
      <span
        v-else-if="store.isConnected"
        class="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-green border-2 border-white rounded-full"
      ></span>
    </button>

    <!-- Dropdown -->
    <Transition name="fade-slide">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-3xl shadow-premium border-2 border-slate-100 overflow-hidden z-[100]"
      >
        <!-- Header -->
        <div
          class="px-6 py-4 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/50"
        >
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs">Уведомления</h3>
          <button
            @click="store.markAllRead"
            class="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline"
          >
            Прочитать все
          </button>
        </div>

        <!-- Notification List -->
        <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
          <div v-if="store.notifications.length === 0" class="p-12 text-center">
            <div class="text-4xl mb-4 grayscale opacity-30">📭</div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
              У вас пока нет уведомлений
            </p>
          </div>

          <div
            v-for="notification in store.notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="p-5 border-b-2 border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group relative"
            :class="{ 'bg-brand-blue/5 border-l-4 border-l-brand-blue': !notification.read }"
          >
            <div class="flex gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-xl shrink-0"
              >
                {{ getEmoji(notification.type) }}
              </div>
              <div class="space-y-1 pr-4">
                <p class="text-xs font-black text-slate-800 uppercase tracking-tight">
                  {{ notification.title }}
                </p>
                <p class="text-[11px] font-bold text-slate-500 leading-snug">
                  {{ notification.message }}
                </p>
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  {{ formatDate(notification.createdAt) }}
                </p>
              </div>
              <div
                v-if="!notification.read"
                class="absolute top-6 right-6 w-2 h-2 bg-brand-blue rounded-full"
              ></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-50/50 text-center border-t-2 border-slate-50">
          <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest uppercase">
            {{ store.isConnected ? '⚡️ В эфире' : '🔌 Подключение...' }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { useNotificationStore } from '~/shared/stores/notifications'
import type { Notification } from '~/shared/stores/notifications'

const store = useNotificationStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    store.fetchRecent()
  }
}

const handleNotificationClick = (n: Notification) => {
  store.markRead(n.id)
  if (n.link) {
    navigateTo(n.link)
    isOpen.value = false
  }
}

const getEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    ASSIGNMENT: '📝',
    COMMENT: '💬',
    SUCCESS: '🌟',
    WARNING: '⚠️',
    ERROR: '🚨',
  }
  return emojis[type] || '🔔'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  store.fetchRecent()
  store.connectSSE()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.shadow-premium {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
