import { useApi } from '@shared/api'

export interface ExecutionResult {
  success: boolean
  output: string | null
  error: string | null
}

export const useExecutionApi = () => {
  const api = useApi()

  const runCode = async (code: string, lessonId?: string): Promise<ExecutionResult> => {
    return await api<ExecutionResult>('/execution/run', {
      method: 'POST',
      body: { code, lessonId },
    })
  }

  return { runCode }
}
