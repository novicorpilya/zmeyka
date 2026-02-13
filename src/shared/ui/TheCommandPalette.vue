<template>
  <Transition name="palette">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 md:px-0"
      @keydown.esc="close"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-md" @click="close"></div>

      <!-- Palette Container -->
      <div
        class="relative w-full max-w-2xl bg-white rounded-[2.5rem] border-8 border-white shadow-[0_30px_100px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col animate-in slide-in-from-top-4 duration-300"
      >
        <!-- Search Header -->
        <div class="p-6 border-b-4 border-slate-50 flex items-center gap-4">
          <span class="text-2xl opacity-40">🔍</span>
          <input
            v-model="searchQuery"
            ref="inputRef"
            type="text"
            placeholder="Что вы хотите сделать? (Напр: 'новый урок')"
            class="flex-grow bg-transparent border-none outline-none font-black text-xl text-slate-800 placeholder:text-slate-200 uppercase tracking-tight"
            @keydown.down.prevent="moveDown"
            @keydown.up.prevent="moveUp"
            @keydown.enter="executeAction"
          />
          <div
            class="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200"
          >
            ESC
          </div>
        </div>

        <!-- Actions List -->
        <div class="max-h-[50vh] overflow-y-auto no-scrollbar p-3 space-y-2">
          <div
            v-for="(action, index) in filteredActions"
            :key="action.id"
            class="group px-6 py-4 rounded-3xl flex items-center justify-between transition-all cursor-pointer"
            :class="
              index === selectedIndex
                ? 'bg-brand-blue text-white shadow-cartoon-sm scale-[1.02] -translate-y-0.5'
                : 'hover:bg-slate-50 text-slate-600'
            "
            @mouseenter="selectedIndex = index"
            @click="handleAction(action)"
          >
            <div class="flex items-center gap-5">
              <span class="text-2xl group-hover:scale-110 transition-transform">{{
                action.icon
              }}</span>
              <div class="flex flex-col">
                <span class="font-black text-xs uppercase tracking-widest leading-none">{{
                  action.title
                }}</span>
                <span
                  v-if="action.subtitle"
                  class="text-[10px] font-bold uppercase tracking-widest mt-1"
                  :class="index === selectedIndex ? 'text-white/60' : 'text-slate-400'"
                >
                  {{ action.subtitle }}
                </span>
              </div>
            </div>

            <div v-if="action.shortcut" class="flex gap-1 items-center">
              <div
                v-for="key in action.shortcut"
                :key="key"
                class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase border-2 transition-colors"
                :class="
                  index === selectedIndex
                    ? 'bg-white/20 border-white/20 text-white'
                    : 'bg-white border-slate-100 text-slate-400'
                "
              >
                {{ key }}
              </div>
            </div>
          </div>

          <div v-if="filteredActions.length === 0" class="py-12 text-center">
            <div class="text-5xl opacity-20 mb-4">🛸</div>
            <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Команда не найдена
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="p-4 bg-slate-50/50 border-t-4 border-slate-50 flex items-center justify-between px-8"
        >
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <div
                class="w-4 h-4 rounded border border-slate-200 bg-white flex items-center justify-center text-[8px] text-slate-400"
              >
                ↑↓
              </div>
              <span
                class="text-[9px] font-black text-slate-400 uppercase tracking-widest tracking-widest"
                >Навигация</span
              >
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-4 rounded border border-slate-200 bg-white flex items-center justify-center text-[8px] text-slate-400"
              >
                ENTER
              </div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest"
                >Выбрать</span
              >
            </div>
          </div>
          <div
            class="text-[9px] font-black text-slate-300 uppercase tracking-widest italic flex items-center gap-2"
          >
            <span class="w-1.5 h-1.5 bg-brand-green rounded-full"></span>
            Zmeyka Engine V1.0
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

import { useCommandPalette, type CommandAction } from '@shared/composables/useCommandPalette'

const { isOpen, actions, close, toggle } = useCommandPalette()

const searchQuery = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const filteredActions = computed(() => {
  if (!searchQuery.value) return actions.value
  const query = searchQuery.value.toLowerCase()
  return actions.value.filter(
    (a) => a.title.toLowerCase().includes(query) || a.subtitle?.toLowerCase().includes(query),
  )
})

watch(isOpen, (val) => {
  if (val) {
    searchQuery.value = ''
    selectedIndex.value = 0
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

watch(filteredActions, () => {
  selectedIndex.value = 0
})

const moveDown = () => {
  if (selectedIndex.value < filteredActions.value.length - 1) {
    selectedIndex.value++
  } else {
    selectedIndex.value = 0
  }
}

const moveUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  } else {
    selectedIndex.value = filteredActions.value.length - 1
  }
}

const handleAction = (action: CommandAction) => {
  action.handler()
  close()
}

const executeAction = () => {
  const action = filteredActions.value[selectedIndex.value]
  if (action) handleAction(action)
}

// Global Key Listeners
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    toggle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.3s;
}
.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}

.shadow-cartoon-sm {
  box-shadow: 0 6px 0 0 #1e40af;
}
</style>
