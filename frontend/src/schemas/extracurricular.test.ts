import { describe, expect, it } from 'vitest'
import { extracurricularSchema } from './extracurricular'

describe('extracurricularSchema', () => {
  it('accepts valid extracurricular input', () => {
    const result = extracurricularSchema.safeParse({
      school_id: 1,
      name: 'Pramuka',
    })

    expect(result.success).toBe(true)
  })

  it('applies default values for category, is_active, and order', () => {
    const result = extracurricularSchema.safeParse({
      school_id: 1,
      name: 'Futsal',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.category).toBe('lainnya')
      expect(result.data.is_active).toBe(true)
      expect(result.data.order).toBe(0)
    }
  })

  it('rejects empty name', () => {
    const result = extracurricularSchema.safeParse({
      school_id: 1,
      name: '',
    })

    expect(result.success).toBe(false)
  })

  it('rejects missing school_id', () => {
    const result = extracurricularSchema.safeParse({
      name: 'Basket',
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid category enum values', () => {
    const categories = ['olahraga', 'seni', 'akademik', 'keagamaan', 'lainnya'] as const
    for (const category of categories) {
      const result = extracurricularSchema.safeParse({
        school_id: 1,
        name: 'Test',
        category,
      })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid category', () => {
    const result = extracurricularSchema.safeParse({
      school_id: 1,
      name: 'Test',
      category: 'invalid',
    })

    expect(result.success).toBe(false)
  })

  it('accepts nullable optional fields', () => {
    const result = extracurricularSchema.safeParse({
      school_id: 1,
      name: 'Kaligrafi',
      description: null,
      schedule: null,
      instructor: null,
      image: null,
    })

    expect(result.success).toBe(true)
  })

  it('rejects name exceeding 200 characters', () => {
    const result = extracurricularSchema.safeParse({
      school_id: 1,
      name: 'A'.repeat(201),
    })

    expect(result.success).toBe(false)
  })

  it('rejects negative order', () => {
    const result = extracurricularSchema.safeParse({
      school_id: 1,
      name: 'Pramuka',
      order: -1,
    })

    expect(result.success).toBe(false)
  })
})
