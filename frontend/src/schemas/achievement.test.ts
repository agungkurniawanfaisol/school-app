import { describe, expect, it } from 'vitest'
import { achievementSchema } from './achievement'

describe('achievementSchema', () => {
  it('accepts valid achievement input', () => {
    const result = achievementSchema.safeParse({
      school_id: 1,
      title: 'Juara 1 Olimpiade Matematika',
      year: 2025,
    })

    expect(result.success).toBe(true)
  })

  it('applies default values for category, level, is_active, order', () => {
    const result = achievementSchema.safeParse({
      school_id: 1,
      title: 'Juara 2 Lomba Pidato',
      year: 2024,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.category).toBe('akademik')
      expect(result.data.level).toBe('sekolah')
      expect(result.data.is_active).toBe(true)
      expect(result.data.order).toBe(0)
    }
  })

  it('rejects empty title', () => {
    const result = achievementSchema.safeParse({
      school_id: 1,
      title: '',
      year: 2025,
    })

    expect(result.success).toBe(false)
  })

  it('rejects year below 2000', () => {
    const result = achievementSchema.safeParse({
      school_id: 1,
      title: 'Prestasi Lama',
      year: 1999,
    })

    expect(result.success).toBe(false)
  })

  it('rejects year above 2100', () => {
    const result = achievementSchema.safeParse({
      school_id: 1,
      title: 'Prestasi Masa Depan',
      year: 2101,
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid category', () => {
    const result = achievementSchema.safeParse({
      school_id: 1,
      title: 'Juara Coding',
      year: 2025,
      category: 'teknologi',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid level', () => {
    const result = achievementSchema.safeParse({
      school_id: 1,
      title: 'Juara Coding',
      year: 2025,
      level: 'dunia',
    })

    expect(result.success).toBe(false)
  })

  it('allows nullable description and student_name', () => {
    const result = achievementSchema.safeParse({
      school_id: 1,
      title: 'Juara Hafalan',
      year: 2024,
      description: null,
      student_name: null,
    })

    expect(result.success).toBe(true)
  })
})
