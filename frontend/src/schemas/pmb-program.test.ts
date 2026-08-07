import { describe, expect, it } from 'vitest'
import { pmbProgramFormSchema } from '@/schemas/pmb-program'

describe('pmbProgramFormSchema', () => {
  it('accepts valid program', () => {
    const result = pmbProgramFormSchema.safeParse({
      school_id: 1,
      code: 'tahfidz',
      name: 'Tahfidz',
      sort_order: 10,
      is_active: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid code', () => {
    const result = pmbProgramFormSchema.safeParse({
      school_id: 1,
      code: 'ICP Plus',
      name: 'ICP Plus',
    })
    expect(result.success).toBe(false)
  })
})
