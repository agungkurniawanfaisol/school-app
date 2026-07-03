import { describe, expect, it } from 'vitest'
import {
  readTeacherPreviewDraft,
  saveTeacherPreviewDraft,
  clearTeacherPreviewDraft,
} from '@/lib/teacherPreviewDraft'

describe('teacherPreviewDraft', () => {
  it('saves and reads draft from sessionStorage', () => {
    clearTeacherPreviewDraft()
    saveTeacherPreviewDraft({
      name: 'Ustadz Demo',
      is_active: true,
      is_featured: false,
      returnTo: '/admin/teachers/create',
    })
    const draft = readTeacherPreviewDraft()
    expect(draft?.name).toBe('Ustadz Demo')
    clearTeacherPreviewDraft()
    expect(readTeacherPreviewDraft()).toBeNull()
  })
})
