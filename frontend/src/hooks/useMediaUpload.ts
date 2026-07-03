import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage } from '@/lib/api'

export interface UploadedMedia {
  uuid: string
  url: string
  path: string
  mime_type: string
  size: number
}

export function useMediaUpload(collection: 'news' | 'activities' | 'facilities' | 'teachers' | 'general' = 'general') {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('collection', collection)

      const { data } = await api.post<{ data: UploadedMedia; message: string }>('/admin/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Gagal mengunggah file.'))
    },
  })
}
