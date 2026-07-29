import { describe, expect, it } from 'vitest'
import { schoolStatSchema } from '@/schemas/schoolStat'

describe('schoolStatSchema', () => {
  it('accepts valid payload', () => {
    const result = schoolStatSchema.safeParse({
      school_id: 1,
      icon: 'users',
      label: 'Siswa',
      value: '500+',
      order: 1,
      is_active: true,
    })
    expect(result.success).toBe(true)
  })

  it('requires label and value', () => {
    const result = schoolStatSchema.safeParse({
      school_id: 1,
      label: '',
      value: '',
    })
    expect(result.success).toBe(false)
  })
})
