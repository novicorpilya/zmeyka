import { useApi } from '~/shared/api'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '~/shared/types'

export interface MessageResponse {
  message: string
}

export const useAuthApi = () => {
  const api = useApi()

  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    return await api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
    })
  }

  const login = async (data: LoginRequest): Promise<AuthResponse> => {
    return await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: data,
    })
  }

  const logout = async (): Promise<void> => {
    return await api('/auth/logout', { method: 'POST' })
  }

  const forgotPassword = async (email: string): Promise<MessageResponse> => {
    return await api<MessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    })
  }

  const resetPassword = async (token: string, newPassword: string): Promise<MessageResponse> => {
    return await api<MessageResponse>('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword },
    })
  }

  const getMe = async (): Promise<User> => {
    return await api<User>('/auth/me', { method: 'POST' })
  }

  const updateProfile = async (data: {
    name?: string
    avatar?: string
    password?: string
  }): Promise<User> => {
    return await api<User>('/auth/profile', {
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
