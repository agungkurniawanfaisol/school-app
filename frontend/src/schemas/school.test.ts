import { describe, expect, it } from 'vitest'
import { schoolSchema } from './school'

describe('schoolSchema', () => {
  it('accepts valid school input', () => {
    const result = schoolSchema.safeParse({
      name: 'Nurul Hikmah School',
      slug: 'nurul-hikmah',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = schoolSchema.safeParse({
      name: '',
      slug: 'nurul-hikmah',
    })

    expect(result.success).toBe(false)
  })
})
