import { describe, expect, it } from 'vitest'
import { academicYearFormSchema } from '@/schemas/academic-year'

describe('academicYearFormSchema', () => {
  it('accepts valid academic year label', () => {
    const result = academicYearFormSchema.safeParse({
      school_id: 1,
      label: '2026/2027',
      is_active: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid label format', () => {
    const result = academicYearFormSchema.safeParse({
      school_id: 1,
      label: '2026-2027',
      is_active: false,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-consecutive years', () => {
    const result = academicYearFormSchema.safeParse({
      school_id: 1,
      label: '2026/2028',
      is_active: false,
    })
    expect(result.success).toBe(false)
  })
})
