<template>
  <div
    class="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-brand-green/5"
  >
    <div
      v-if="payment"
      class="max-w-md w-full bg-white rounded-[3rem] shadow-cartoon p-10 space-y-8 text-center animate-in fade-in zoom-in duration-500"
    >
      <div
        class="w-24 h-24 bg-brand-blue/10 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner relative overflow-hidden group"
      >
        <div class="absolute inset-0 bg-brand-blue/5 animate-pulse"></div>
        <span class="relative z-10 group-hover:scale-110 transition-transform">💳</span>
      </div>

      <div class="space-y-3">
        <h2 class="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">
          Оплата обучения
        </h2>
        <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Курс: <span class="text-slate-600">{{ payment.course?.title }}</span>
        </p>
      </div>

      <div class="py-8 border-y-4 border-slate-50 space-y-2 bg-slate-50/30 rounded-2xl">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          К оплате (тестовый шлюз)
        </p>
        <div class="flex items-center justify-center gap-2">
          <p class="text-5xl font-black text-brand-blue">{{ payment.amount }}</p>
          <span class="text-2xl font-black text-brand-blue/40 mt-3">₽</span>
        </div>
      </div>

      <div class="space-y-4">
        <button
          @click="confirm"
          :disabled="isProcessing"
          class="w-full py-6 bg-brand-green text-white rounded-[2rem] font-black text-lg shadow-[0_10px_0_0_#166534] hover:translate-y-1 hover:shadow-[0_5px_0_0_#166534] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span
            v-if="isProcessing"
            class="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          <template v-else>
            ОПЛАТИТЬ И ОБУЧАТЬСЯ
            <span class="group-hover:translate-x-2 transition-transform">🚀</span>
          </template>
        </button>

        <button
          @click="cancel"
          class="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-400 transition-colors"
        >
          Отменить и вернуться
        </button>
      </div>

      <div
        class="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100/50"
      >
        <span class="text-xl">🔒</span>
        <p class="text-[9px] font-bold text-slate-400 uppercase leading-tight text-left">
          Безопасное соединение. Ваши данные зашифрованы и защищены по стандарту PCI DSS.
        </p>
      </div>
    </div>

    <div v-else-if="isLoading" class="flex flex-col items-center gap-6">
      <div
        class="w-16 h-16 border-8 border-slate-100 border-t-brand-blue rounded-full animate-spin"
      ></div>
      <p class="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
        Загрузка платежа...
      </p>
    </div>

    <div v-else class="text-center space-y-6">
      <div class="text-6xl">⚠️</div>
      <h3 class="text-2xl font-black text-slate-800 uppercase">Платеж не найден</h3>
      <NuxtLink
        to="/courses"
        class="inline-block px-8 py-4 bg-brand-blue text-white rounded-2xl font-black uppercase text-xs"
        >К списку курсов</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import type { PaymentDetails } from '@entities/payment/api'
import { usePaymentApi } from '@entities/payment/api'
import { useToast } from '@shared/composables/useToast'

const route = useRoute()
const router = useRouter()
const paymentId = route.query.id as string
const { getPayment, verifyPayment } = usePaymentApi()
const toast = useToast()

const payment = ref<PaymentDetails | null>(null)
const isLoading = ref(true)
const isProcessing = ref(false)

const fetchPayment = async () => {
  if (!paymentId) {
    isLoading.value = false
    return
  }
  try {
    payment.value = await getPayment(paymentId)
  } catch {
    // Payment fetch failed
  } finally {
    isLoading.value = false
  }
}

const confirm = async () => {
  if (!paymentId) return
  isProcessing.value = true
  try {
    const res = await verifyPayment(paymentId)
    toast.success('Оплата прошла успешно! 🎉')
    router.push(`/courses/${res.courseId}`)
  } catch (err) {
    toast.error('Ошибка при обработке платежа')
  } finally {
    isProcessing.value = false
  }
}

const cancel = () => {
  router.back()
}

onMounted(fetchPayment)

definePageMeta({
  middleware: ['auth'],
  layout: false,
})
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 16px 0 0 #f1f5f9;
}
</style>
