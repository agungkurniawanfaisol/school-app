import { describe, expect, it } from 'vitest'
import { pmbRegisterSchema, pmbTrackSchema } from './pmb'

describe('pmbRegisterSchema', () => {
  it('accepts valid register input', () => {
    const result = pmbRegisterSchema.safeParse({
      school_id: 1,
      student_name: 'Ahmad Fauzi',
      parent_name: 'Budi Santoso',
      parent_phone: '081234567890',
      grade_applied: 'Kelas 1 SD',
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = pmbRegisterSchema.safeParse({
      school_id: 1,
      student_name: '',
      parent_name: '',
      parent_phone: '',
      grade_applied: '',
    })

    expect(result.success).toBe(false)
  })
})

describe('pmbTrackSchema', () => {
  it('accepts valid tracking token', () => {
    const result = pmbTrackSchema.safeParse({
      token: 'abc123456789',
    })

    expect(result.success).toBe(true)
  })

  it('rejects token shorter than 10 characters', () => {
    const result = pmbTrackSchema.safeParse({
      token: 'pendek',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.token).toBeDefined()
    }
  })
})
