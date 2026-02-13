<template>
  <div class="fixed inset-0 z-[10000] pointer-events-none">
    <TransitionGroup name="modal">
      <div
        v-for="modal in modals"
        :key="modal.id"
        class="fixed inset-0 flex items-center justify-center p-6 pointer-events-auto"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          @click="close(modal.id, null)"
        ></div>

        <!-- Modal Content -->
        <div
          class="relative w-full bg-white rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden animate-modal-in"
          :class="modal.type === 'preview' ? 'max-w-6xl h-[85vh]' : 'max-w-lg'"
        >
          <!-- Preview Mode -->
          <template v-if="modal.type === 'preview'">
            <div class="h-full flex flex-col">
              <div
                class="p-4 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/50"
              >
                <div class="flex items-center gap-3">
                  <span class="text-xl">👁️</span>
                  <p class="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {{ modal.title }}
                  </p>
                </div>
                <button
                  @click="close(modal.id, null)"
                  class="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all font-black"
                >
                  ×
                </button>
              </div>
              <iframe :src="modal.url" class="flex-grow w-full border-none"></iframe>
            </div>
          </template>

          <!-- Standard Modes -->
          <div v-else class="p-10 space-y-8">
            <!-- Header/Icon -->
            <div class="flex flex-col items-center text-center space-y-4">
              <div
                class="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-sm border-4 border-slate-100 italic"
              >
                {{ modal.type === 'confirm' ? '⚠️' : modal.type === 'prompt' ? '📝' : 'ℹ️' }}
              </div>
              <h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight italic">
                {{ modal.title }}
              </h3>
              <p v-if="modal.message" class="text-slate-400 font-bold leading-relaxed">
                {{ modal.message }}
              </p>
            </div>

            <!-- Input for Prompt -->
            <div v-if="modal.type === 'prompt'" class="relative">
              <input
                v-model="inputValue"
                type="text"
                :placeholder="modal.placeholder"
                class="w-full px-8 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-black text-slate-700 outline-none focus:border-brand-blue focus:bg-white transition-all text-center uppercase tracking-widest placeholder:text-slate-200"
                autofocus
                @keyup.enter="handleConfirm(modal)"
              />
            </div>

            <!-- Buttons -->
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="close(modal.id, null)"
                class="py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all border-4 border-transparent active:scale-95"
              >
                {{ modal.cancelText }}
              </button>
              <button
                @click="handleConfirm(modal)"
                class="py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-cartoon-sm active:translate-y-1 active:shadow-none active:scale-95"
                :class="
                  modal.type === 'confirm'
                    ? 'bg-red-500 text-white shadow-[0_8px_0_0_#991b1b]'
                    : 'bg-brand-blue text-white shadow-[0_8px_0_0_#1e40af]'
                "
              >
                {{ modal.confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { useModal, type ModalState } from '@shared/composables/useModal'

const { modals, close } = useModal()
const inputValue = ref('')

watch(
  () => modals.value.length,
  (newLen) => {
    if (newLen > 0) {
      const active = modals.value[modals.value.length - 1]
      inputValue.value = active.initialValue || ''
    }
  },
)

const handleConfirm = (modal: ModalState) => {
  if (modal.type === 'prompt') {
    close(modal.id, inputValue.value)
  } else {
    close(modal.id, true)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes modal-in {
  from {
    transform: scale(0.8) translateY(40px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-modal-in {
  animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.shadow-cartoon-sm {
  /* Dynamic shadows are replaced by classes in template */
}
</style>
