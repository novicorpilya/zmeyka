import { useApi } from '@shared/api'

export const useUploadApi = () => {
  const api = useApi()

  return {
    uploadVideo: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData()
      formData.append('file', file)
      return await api('/upload/video', {
        method: 'POST',
        body: formData,
      })
    },
    uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData()
      formData.append('file', file)
      return await api('/upload/file', {
        method: 'POST',
        body: formData,
      })
    },
    deleteVideo: async (filename: string): Promise<void> => {
      return await api(`/upload/video/${filename}`, { method: 'DELETE' })
    },
    deleteFile: async (filename: string): Promise<void> => {
      return await api(`/upload/file/${filename}`, { method: 'DELETE' })
    },
  }
}
