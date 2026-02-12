import { useToast } from '~/shared/composables/useToast'

export default defineNuxtPlugin(() => {
  const toast = useToast()

  return {
    provide: {
      toast,
    },
  }
})
