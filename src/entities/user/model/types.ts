export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface RefreshResponse {
  accessToken: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface UserStats {
  xp: number
  level: number
  streak: number
  completedCourses: number
  completedLessons: number
}
