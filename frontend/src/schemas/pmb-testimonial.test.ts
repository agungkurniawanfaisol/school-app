import { describe, expect, it } from 'vitest'
import { pmbTestimonialSchema } from '@/schemas/pmb-testimonial'

describe('pmbTestimonialSchema', () => {
  it('accepts valid testimonial input', () => {
    const result = pmbTestimonialSchema.safeParse({
      content: 'Sekolah yang sangat baik untuk perkembangan anak.',
      rating: 5,
      photo_media_id: 1,
    })

    expect(result.success).toBe(true)
  })

  it('rejects short content and invalid rating', () => {
    expect(
      pmbTestimonialSchema.safeParse({
        content: 'pendek',
        rating: 5,
      }).success,
    ).toBe(false)

    expect(
      pmbTestimonialSchema.safeParse({
        content: 'Sekolah yang sangat baik untuk perkembangan anak.',
        rating: 0,
      }).success,
    ).toBe(false)
  })
})
