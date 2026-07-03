import { describe, expect, it } from 'vitest'
import { facilitySchema } from './facility'

describe('facilitySchema', () => {
  it('accepts valid facility input', () => {
    const result = facilitySchema.safeParse({
      school_id: 1,
      name: 'Perpustakaan',
      slug: 'perpustakaan',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = facilitySchema.safeParse({
      school_id: 1,
      name: '',
      slug: 'perpustakaan',
    })

    expect(result.success).toBe(false)
  })
})
