<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6 md:space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      <div class="space-y-2.5">
        <label
          for="profile-name"
          class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1"
          >Имя в системе</label
        >
        <input
          id="profile-name"
          :value="name"
          @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Мастер Питон"
          class="w-full px-5 py-3.5 md:px-6 md:py-5 bg-slate-50 border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-brand-green/20"
        />
      </div>
      <div class="space-y-2.5">
        <label
          for="profile-email"
          class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1"
          >Email</label
        >
        <input
          id="profile-email"
          type="email"
          :value="email"
          disabled
          class="w-full px-5 py-3.5 md:px-6 md:py-5 bg-slate-100 border-4 border-slate-100 rounded-xl md:rounded-2xl font-bold text-slate-400 cursor-not-allowed shadow-none"
        />
      </div>
    </div>

    <div aria-live="polite" class="space-y-4">
      <div
        v-if="success"
        class="p-4 md:p-6 bg-green-50 border-2 border-green-100 rounded-xl md:rounded-2xl text-green-600 font-bold text-xs md:text-sm flex items-center gap-3 md:gap-4 animate-in slide-in-from-bottom-2"
      >
        <span class="text-xl md:text-2xl" aria-hidden="true">✨</span> Маскировка успешно обновлена!
      </div>

      <div
        v-if="error"
        class="p-4 md:p-6 bg-red-50 border-2 border-red-100 rounded-xl md:rounded-2xl text-red-500 font-bold text-xs md:text-sm flex items-center gap-3 md:gap-4 animate-in slide-in-from-bottom-2"
      >
        <span class="text-xl md:text-2xl" aria-hidden="true">⚠️</span> {{ error }}
      </div>
    </div>

    <div class="pt-2">
      <button
        type="submit"
        :disabled="loading"
        class="w-full md:w-auto bg-brand-green px-10 py-4.5 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-black text-white text-lg md:text-xl shadow-[0_6px_0_0_#166534] md:shadow-[0_8px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-brand-green/30"
      >
        <span v-if="loading" class="animate-spin text-xl text-white" aria-hidden="true">⏳</span>
        <span>{{ loading ? 'Сохранение...' : 'Сохранить изменения' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  email?: string
  loading: boolean
  success: boolean
  error: string
}>()

defineEmits(['update:name', 'submit'])
</script>
