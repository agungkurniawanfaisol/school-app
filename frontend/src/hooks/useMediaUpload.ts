import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage } from '@/lib/api'
import { validateUploadFile, type UploadMediaKind } from '@/lib/uploadValidation'

export interface UploadedMedia {
  uuid: string
  url: string
  path: string
  mime_type: string
  size: number
}

export function useMediaUpload(collection: 'news' | 'activities' | 'facilities' | 'teachers' | 'general' | 'virtual-tour' = 'general') {
  return useMutation({
    mutationFn: async (file: File) => {
      const kind: UploadMediaKind = file.type.startsWith('video/') ? 'video' : 'image'
      const validationError = validateUploadFile(file, kind)
      if (validationError) {
        throw new Error(validationError)
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('collection', collection)

      const { data } = await api.post<{ data: UploadedMedia; message: string }>('/admin/uploads', formData)
      return data.data
    },
    onError: (error) => {
      const message = error instanceof Error && error.message ? error.message : getApiErrorMessage(error, 'Gagal mengunggah file.')
      toast.error(message)
    },
  })
}
