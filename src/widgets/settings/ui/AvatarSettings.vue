<template>
  <div class="space-y-6">
    <h2 class="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">
      Твой образ
    </h2>

    <div
      class="flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-10 p-6 md:p-8 bg-slate-50 rounded-[2rem] md:rounded-[3rem] border-2 border-slate-100"
    >
      <!-- Current Avatar Preview -->
      <div
        class="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[1.5rem] md:rounded-[2.5rem] shrink-0 overflow-hidden flex items-center justify-center text-5xl md:text-7xl shadow-cartoon border-4 border-white transition-all hover:scale-[1.02] relative group mx-auto md:mx-0"
      >
        <template v-if="avatar && avatar.startsWith('data:image')">
          <img :src="avatar" class="w-full h-full object-cover" />
        </template>
        <template v-else>
          {{ avatar || '🐍' }}
        </template>

        <!-- Overlay for upload on hover -->
        <label
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
        >
          <span class="text-2xl">📸</span>
          <span class="text-[8px] font-black uppercase tracking-widest mt-1 text-center px-2"
            >Изменить фото</span
          >
          <input type="file" @change="onFileUpload" class="hidden" accept="image/*" />
        </label>
      </div>

      <div class="space-y-6 flex-grow flex flex-col justify-center">
        <div class="text-center md:text-left">
          <p class="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs">
            Выбери персонажа или загрузи своё:
          </p>
        </div>

        <div class="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <button
            v-for="emoji in avatarOptions"
            :key="emoji"
            @click="$emit('update:avatar', emoji)"
            type="button"
            :aria-label="'Выбрать аватар ' + emoji"
            class="aspect-square bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl border-2 transition-all hover:scale-110 active:scale-95 shadow-sm overflow-hidden shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            :class="[
              avatar === emoji
                ? 'border-brand-green bg-brand-green/5 ring-4 ring-brand-green/20'
                : 'border-slate-100',
            ]"
          >
            <span class="block transform-gpu" aria-hidden="true">{{ emoji }}</span>
          </button>

          <!-- Custom Upload Trigger in Grid -->
          <label
            class="aspect-square bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl border-2 border-dashed border-slate-300 transition-all hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer shrink-0 focus-within:ring-2 focus-within:ring-brand-blue focus-within:ring-offset-2"
            aria-label="Загрузить собственное фото"
          >
            <span aria-hidden="true">📁</span>
            <input type="file" @change="onFileUpload" class="hidden" accept="image/*" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
}>()

const emit = defineEmits(['update:avatar', 'upload-error'])

const avatarOptions = ['🐍', '🐲', '🐊', '🦎', '🦕', '🦖', '🐉']

const onFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    emit('upload-error', 'Файл слишком большой! Максимум 2МБ')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:avatar', e.target?.result as string)
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
