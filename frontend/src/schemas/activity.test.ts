import { describe, expect, it } from 'vitest'
import { activitySchema } from './activity'

describe('activitySchema', () => {
  it('accepts valid activity input', () => {
    const result = activitySchema.safeParse({
      school_id: 1,
      title: 'Lomba Tahfidz',
      slug: 'lomba-tahfidz',
      content: 'Deskripsi kegiatan',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = activitySchema.safeParse({
      school_id: 1,
      title: '',
      slug: 'lomba-tahfidz',
    })

    expect(result.success).toBe(false)
  })
})
