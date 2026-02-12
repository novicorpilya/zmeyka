export * from '../../entities/user/model/types'
export * from '../../entities/course/model/types'
export * from '../../entities/dashboard/model/types'
export * from '../../entities/teacher/model/types'
export * from '../../entities/homework/model/types'

export interface Socket {
  on(event: string, callback: (...args: unknown[]) => void): void
  off(event: string, callback?: (...args: unknown[]) => void): void
  emit(event: string, ...args: unknown[]): void
}
