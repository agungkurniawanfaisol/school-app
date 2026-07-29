export const ALLOWED_UPLOAD_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const ALLOWED_UPLOAD_VIDEO_TYPES = ['video/mp4', 'video/webm'] as const
export const ALLOWED_PMB_PROOF_TYPES = [...ALLOWED_UPLOAD_IMAGE_TYPES, 'application/pdf'] as const
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024
export const MAX_PMB_PHOTO_BYTES = 1024 * 1024
export const MAX_PMB_PROOF_BYTES = 10 * 1024 * 1024

export type UploadMediaKind = 'image' | 'video'
export type PmbUploadPurpose = 'student_photo' | 'payment_proof' | 'testimonial_photo'

export function validateUploadFile(file: File, kind: UploadMediaKind): string | null {
  const allowed = kind === 'image' ? ALLOWED_UPLOAD_IMAGE_TYPES : ALLOWED_UPLOAD_VIDEO_TYPES

  if (!(allowed as readonly string[]).includes(file.type)) {
    return kind === 'image'
      ? 'Format gambar harus JPG, PNG, atau WebP.'
      : 'Format video harus MP4 atau WebM.'
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Ukuran file melebihi 50 MB.'
  }

  return null
}

export function validatePmbUpload(file: File, purpose: PmbUploadPurpose): string | null {
  const allowed = purpose === 'payment_proof' ? ALLOWED_PMB_PROOF_TYPES : ALLOWED_UPLOAD_IMAGE_TYPES
  const maxBytes = purpose === 'payment_proof' ? MAX_PMB_PROOF_BYTES : MAX_PMB_PHOTO_BYTES

  if (!(allowed as readonly string[]).includes(file.type)) {
    return purpose === 'payment_proof'
      ? 'Format bukti harus JPG, PNG, WebP, atau PDF.'
      : 'Format foto harus JPG, PNG, atau WebP.'
  }

  if (file.size > maxBytes) {
    return purpose === 'payment_proof'
      ? 'Ukuran bukti maksimal 10 MB.'
      : 'Ukuran foto maksimal 1 MB.'
  }

  return null
}

export function isAllowedImageFile(file: File): boolean {
  return validateUploadFile(file, 'image') === null
}
