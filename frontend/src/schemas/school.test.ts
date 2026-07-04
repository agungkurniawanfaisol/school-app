import { describe, expect, it } from 'vitest'
import { MISSION_MAX_LENGTH, schoolSchema, socialMediaSchema, visionMissionSchema, VISION_MAX_LENGTH } from './school'

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

  it('accepts social_media and map fields', () => {
    const result = schoolSchema.safeParse({
      name: 'Sekolah',
      slug: 'sekolah',
      social_media: {
        facebook: 'https://facebook.com/nurulhikmah',
        instagram: '@nurulhikmah',
        youtube: null,
      },
      map_embed_url: 'https://www.google.com/maps/embed?pb=xxx',
      latitude: -6.2615025,
      longitude: 106.7816014,
    })

    expect(result.success).toBe(true)
  })

  it('rejects latitude out of range', () => {
    const result = schoolSchema.safeParse({
      name: 'Sekolah',
      slug: 'sekolah',
      latitude: 95,
    })

    expect(result.success).toBe(false)
  })
})

describe('socialMediaSchema', () => {
  it('accepts valid social media links', () => {
    const result = socialMediaSchema.safeParse({
      facebook: 'https://facebook.com/school',
      instagram: '@school',
      youtube: 'https://youtube.com/@school',
    })

    expect(result.success).toBe(true)
  })

  it('accepts all null values', () => {
    const result = socialMediaSchema.safeParse({
      facebook: null,
      instagram: null,
      youtube: null,
    })

    expect(result.success).toBe(true)
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
