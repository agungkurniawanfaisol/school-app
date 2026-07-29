import { describe, expect, it } from 'vitest'
import { isPmbStudentPhotoWithinLimit, PMB_STUDENT_PHOTO_MAX_BYTES } from './pmb-upload-limits'

describe('pmb-upload-limits', () => {
  it('allows files up to 1 MB', () => {
    expect(isPmbStudentPhotoWithinLimit({ size: PMB_STUDENT_PHOTO_MAX_BYTES } as File)).toBe(true)
  })

  it('rejects files over 1 MB', () => {
    expect(isPmbStudentPhotoWithinLimit({ size: PMB_STUDENT_PHOTO_MAX_BYTES + 1 } as File)).toBe(false)
  })
})
