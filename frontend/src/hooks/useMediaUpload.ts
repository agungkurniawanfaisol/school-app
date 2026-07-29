import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { api, getApiErrorMessage } from '@/lib/api'
import { compressImageFile } from '@/lib/compressImage'
import {
  ALLOWED_UPLOAD_IMAGE_TYPES,
  ALLOWED_UPLOAD_VIDEO_TYPES,
  MAX_UPLOAD_BYTES,
  validateUploadFile,
  type UploadMediaKind,
} from '@/lib/uploadValidation'

export interface UploadedMedia {
  uuid: string
  url: string
  path: string
  mime_type: string
  size: number
}

export type UploadPhase = 'idle' | 'compressing' | 'uploading'

/** Skip resize for equirectangular panoramas. */
const SKIP_COMPRESS_COLLECTIONS = new Set(['virtual-tour'])

const ADMIN_IMAGE_MAX_EDGE = 1920
const ADMIN_SOURCE_MAX_BYTES = 25 * 1024 * 1024

export function useMediaUpload(
  collection: 'news' | 'activities' | 'facilities' | 'teachers' | 'general' | 'virtual-tour' = 'general',
) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<UploadPhase>('idle')

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const kind: UploadMediaKind = file.type.startsWith('video/') ? 'video' : 'image'
      const allowed = kind === 'image' ? ALLOWED_UPLOAD_IMAGE_TYPES : ALLOWED_UPLOAD_VIDEO_TYPES
      if (!(allowed as readonly string[]).includes(file.type)) {
        throw new Error(
          kind === 'image'
            ? 'Format gambar harus JPG, PNG, atau WebP.'
            : 'Format video harus MP4 atau WebM.',
        )
      }
      if (file.size > ADMIN_SOURCE_MAX_BYTES) {
        throw new Error('Ukuran file sumber terlalu besar untuk diunggah.')
      }

      setProgress(0)
      let uploadFile = file

      if (kind === 'image' && !SKIP_COMPRESS_COLLECTIONS.has(collection)) {
        setPhase('compressing')
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve())
        })
        uploadFile = await compressImageFile(file, {
          maxEdge: ADMIN_IMAGE_MAX_EDGE,
          maxBytes: Math.min(MAX_UPLOAD_BYTES, 2 * 1024 * 1024),
          quality: 0.72,
          mimeType: 'image/jpeg',
        })
      }

      const validationError = validateUploadFile(uploadFile, kind)
      if (validationError) {
        throw new Error(validationError)
      }

      setPhase('uploading')
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('collection', collection)

      const { data } = await api.post<{ data: UploadedMedia; message: string }>(
        '/admin/uploads',
        formData,
        {
          onUploadProgress: (event) => {
            if (!event.total) return
            setProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)))
          },
        },
      )
      setProgress(100)
      return data.data
    },
    onError: (error) => {
      const message =
        error instanceof Error && error.message ? error.message : getApiErrorMessage(error, 'Gagal mengunggah file.')
      toast.error(message)
    },
    onSettled: () => {
      setPhase('idle')
      setProgress(0)
    },
  })

  return { ...mutation, progress, phase }
}
