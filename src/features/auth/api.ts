import { useApi } from '~/shared/api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '~/shared/types'

export const useAuthApi = () => {
  const api = useApi()

  const register = async (data: RegisterRequest) => {
    return await api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
    })
  }

  const login = async (data: LoginRequest) => {
    return await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: data,
    })
  }

  const logout = async () => {
    return await api('/auth/logout', { method: 'POST' })
  }

  const forgotPassword = async (email: string) => {
    return await api('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    })
  }

  const resetPassword = async (token: string, newPassword: string) => {
    return await api('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword },
    })
  }

  const getMe = async () => {
    return await api('/auth/me', { method: 'POST' })
  }

  const updateProfile = async (data: { name?: string; avatar?: string; password?: string }) => {
    return await api('/auth/profile', {
      method: 'PATCH',
      body: data,
    })
  }

  return {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getMe,
    updateProfile,
  }
}
