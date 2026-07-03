export const ALLOWED_UPLOAD_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const ALLOWED_UPLOAD_VIDEO_TYPES = ['video/mp4', 'video/webm'] as const
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024

export type UploadMediaKind = 'image' | 'video'

export function validateUploadFile(file: File, kind: UploadMediaKind): string | null {
  const allowed = kind === 'image' ? ALLOWED_UPLOAD_IMAGE_TYPES : ALLOWED_UPLOAD_VIDEO_TYPES

  if (!allowed.includes(file.type as (typeof allowed)[number])) {
    return kind === 'image'
      ? 'Format gambar harus JPG, PNG, atau WebP.'
      : 'Format video harus MP4 atau WebM.'
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Ukuran file melebihi 50 MB.'
  }

  return null
}

export function isAllowedImageFile(file: File): boolean {
  return validateUploadFile(file, 'image') === null
}
