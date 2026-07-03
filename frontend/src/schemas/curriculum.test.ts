import { describe, expect, it } from 'vitest'
import { curriculumSchema } from './curriculum'

describe('curriculumSchema', () => {
  it('accepts valid curriculum input', () => {
    const result = curriculumSchema.safeParse({
      school_id: 1,
      title: 'Program Tahfidz',
      slug: 'program-tahfidz',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = curriculumSchema.safeParse({
      school_id: 1,
      title: '',
      slug: 'program-tahfidz',
    })

    expect(result.success).toBe(false)
  })
})
