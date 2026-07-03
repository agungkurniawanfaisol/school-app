import { describe, expect, it } from 'vitest'
import { MISSION_MAX_LENGTH, schoolSchema, visionMissionSchema, VISION_MAX_LENGTH } from './school'

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

  it('rejects vision longer than max', () => {
    const result = schoolSchema.safeParse({
      name: 'Sekolah',
      slug: 'sekolah',
      vision: 'a'.repeat(VISION_MAX_LENGTH + 1),
    })

    expect(result.success).toBe(false)
  })
})

describe('visionMissionSchema', () => {
  it('accepts valid vision and mission', () => {
    const result = visionMissionSchema.safeParse({
      vision: 'Menjadi sekolah unggulan',
      mission: '1. Poin pertama\n2. Poin kedua',
    })

    expect(result.success).toBe(true)
  })

  it('rejects mission longer than max', () => {
    const result = visionMissionSchema.safeParse({
      mission: 'x'.repeat(MISSION_MAX_LENGTH + 1),
    })

    expect(result.success).toBe(false)
  })
})
