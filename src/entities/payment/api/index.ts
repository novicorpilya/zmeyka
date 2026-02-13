import { useApi } from '@shared/api'

export interface PaymentDetails {
  id: string
  status: string
  amount: number
  courseId: string
  userId: string
  provider: string
  course?: { id: string; title: string }
  createdAt: string
}

export const usePaymentApi = () => {
  const api = useApi()

  return {
    createPayment: (
      courseId: string,
    ): Promise<{
      paymentId?: string
      status: string
      amount?: number
      checkoutUrl?: string
      message?: string
    }> => api('/payments/create', { method: 'POST', body: { courseId } }),

    getPayment: (paymentId: string): Promise<PaymentDetails> =>
      api(`/payments/${paymentId}`, { method: 'GET' }),

    verifyPayment: (paymentId: string): Promise<PaymentDetails> =>
      api(`/payments/${paymentId}/verify`, { method: 'POST' }),
  }
}
