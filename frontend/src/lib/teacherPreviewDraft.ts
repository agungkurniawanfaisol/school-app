import type { EditorDocument } from '@/schemas/editor'
import type { SocialMedia } from '@/types'

const STORAGE_KEY = 'nh_teacher_preview_draft'

export interface TeacherPreviewDraft {
  uuid?: string
  name: string
  title?: string | null
  subject?: string | null
  bio?: string | null
  photo?: string | null
  email?: string | null
  social_media?: SocialMedia | null
  content?: string | null
  content_json?: EditorDocument | null
  is_active: boolean
  is_featured: boolean
  returnTo: string
}

export function saveTeacherPreviewDraft(draft: TeacherPreviewDraft): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
}

export function readTeacherPreviewDraft(): TeacherPreviewDraft | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as TeacherPreviewDraft
  } catch {
    return null
  }
}

export function clearTeacherPreviewDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}
