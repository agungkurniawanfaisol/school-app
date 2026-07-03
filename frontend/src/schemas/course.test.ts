import { describe, expect, it } from 'vitest'
import { courseSchema } from './course'

describe('courseSchema', () => {
  it('accepts valid course input', () => {
    const result = courseSchema.safeParse({
      school_id: 1,
      title: 'Belajar Tajwid',
      slug: 'belajar-tajwid',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = courseSchema.safeParse({
      school_id: 1,
      title: '',
      slug: 'belajar-tajwid',
    })

    expect(result.success).toBe(false)
  })
})
