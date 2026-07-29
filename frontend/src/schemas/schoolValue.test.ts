import { describe, expect, it } from 'vitest'
import { schoolValueSchema } from './schoolValue'

describe('schoolValueSchema', () => {
  it('accepts valid school value input', () => {
    const result = schoolValueSchema.safeParse({
      school_id: 1,
      icon: 'heart',
      title: 'Akhlak',
      description: 'Membentuk karakter mulia berdasarkan Al-Quran dan Sunnah.',
      order: 1,
      is_active: true,
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = schoolValueSchema.safeParse({
      school_id: 1,
      title: '',
      description: 'Deskripsi nilai.',
    })

    expect(result.success).toBe(false)
  })

  it('rejects empty description', () => {
    const result = schoolValueSchema.safeParse({
      school_id: 1,
      title: 'Akhlak',
      description: '',
    })

    expect(result.success).toBe(false)
  })
})
