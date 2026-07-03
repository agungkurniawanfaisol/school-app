import { describe, expect, it } from 'vitest'
import { testimonialSchema } from './testimonial'

describe('testimonialSchema', () => {
  it('accepts valid testimonial input', () => {
    const result = testimonialSchema.safeParse({
      school_id: 1,
      name: 'Ibu Siti',
      content: 'Sekolah yang sangat baik untuk anak kami.',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty content', () => {
    const result = testimonialSchema.safeParse({
      school_id: 1,
      name: 'Ibu Siti',
      content: '',
    })

    expect(result.success).toBe(false)
  })
})
