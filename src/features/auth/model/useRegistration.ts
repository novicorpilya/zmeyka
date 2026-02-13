import { ref, reactive } from 'vue'

import { useUserStore } from '@entities/user/model/store'
import { useAuthApi } from '@features/auth/api'

export const useRegistration = () => {
  const router = useRouter()
  const userStore = useUserStore()
  const { register } = useAuthApi()

  const step = ref(1)
  const loading = ref(false)
  const error = ref('')

  const form = reactive({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER',
  })

  const selectRole = (role: 'STUDENT' | 'TEACHER') => {
    form.role = role
    step.value = 2
  }

  const handleRegister = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await register(form)
      userStore.setUser(response.user, response.accessToken)
      router.push('/dashboard')
      return true
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string }; message?: string }
      error.value =
        errorData.data?.message || errorData.message || 'Ошибка регистрации. Попробуй другую почту!'
      return false
    } finally {
      loading.value = false
    }
  }

  const goBack = () => {
    step.value = 1
  }

  return {
    step,
    form,
    loading,
    error,
    selectRole,
    handleRegister,
    goBack,
  }
}
