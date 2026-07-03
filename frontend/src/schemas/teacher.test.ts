import { describe, expect, it } from 'vitest'
import { teacherSchema } from './teacher'

describe('teacherSchema', () => {
  it('accepts valid teacher input', () => {
    const result = teacherSchema.safeParse({
      school_id: 1,
      name: 'Ustadz Ahmad',
      slug: 'ustadz-ahmad',
    })

    expect(result.success).toBe(true)
  })

  it('accepts content_json and social_media', () => {
    const result = teacherSchema.safeParse({
      school_id: 1,
      name: 'Ustadz Ahmad',
      slug: 'ustadz-ahmad',
      content_json: { type: 'doc', content: [] },
      social_media: {
        instagram: 'https://instagram.com/guru',
      },
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = teacherSchema.safeParse({
      school_id: 1,
      name: '',
      slug: 'ustadz-ahmad',
    })

    expect(result.success).toBe(false)
  })
})
