<template>
  <div
    class="p-8 bg-white rounded-[2rem] shadow-premium border-4 border-emerald-50 text-center space-y-6"
  >
    <div
      class="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-4xl"
    >
      🎓
    </div>

    <div class="space-y-2">
      <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Поздравляем!</h3>
      <p class="text-slate-500 font-medium">Ваш сертификат за курс «{{ courseName }}» готов.</p>
    </div>

    <div class="pt-4">
      <button
        @click="handleDownload"
        :disabled="isGenerating"
        class="w-full bg-slate-900 hover:bg-black text-white font-black py-4 px-8 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 group shadow-xl shadow-slate-900/10"
      >
        <span v-if="isGenerating" class="animate-spin text-xl">⏳</span>
        <span v-else class="group-hover:-translate-y-1 transition-transform">📄</span>
        {{ isGenerating ? 'Генерация...' : 'Скачать сертификат (PNG)' }}
      </button>
    </div>

    <p class="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
      Zmeyka.io Certification Authority
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { generateCertificate } from '../model/generator'

const props = defineProps<{
  userName: string
  courseName: string
}>()

const isGenerating = ref(false)

const handleDownload = async () => {
  if (isGenerating.value) return
  isGenerating.value = true

  try {
    const today = new Date().toLocaleDateString('ru-RU')
    const dataUrl = await generateCertificate(props.userName, props.courseName, today)

    // Create download link
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `Certificate_${props.userName.replace(/\s+/g, '_')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Certification failed:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.shadow-premium {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
}
</style>
