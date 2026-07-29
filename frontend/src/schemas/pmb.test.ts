import { describe, expect, it } from 'vitest'
import { pmbRegisterSchema, pmbPortalDraftSchema } from './pmb'

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

describe('pmbPortalDraftSchema', () => {
  it('allows partial draft values for autosave', () => {
    expect(
      pmbPortalDraftSchema.safeParse({
        student_name: 'Ahmad',
      }).success,
    ).toBe(true)
  })
})
