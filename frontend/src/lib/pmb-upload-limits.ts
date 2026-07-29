export const PMB_STUDENT_PHOTO_MAX_BYTES = 1024 * 1024

export const PMB_STUDENT_PHOTO_HINT = 'JPG, PNG, atau WEBP. Maks. 1 MB.'

export function isPmbStudentPhotoWithinLimit(file: File): boolean {
  return file.size <= PMB_STUDENT_PHOTO_MAX_BYTES
}
