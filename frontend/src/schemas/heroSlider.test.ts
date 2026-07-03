import { describe, expect, it } from 'vitest'
import { heroSliderSchema } from '@/schemas/heroSlider'

describe('heroSliderSchema', () => {
  it('accepts valid hero slider payload', () => {
    const result = heroSliderSchema.safeParse({
      school_id: 1,
      title: 'Selamat Datang',
      image: '/storage/hero.jpg',
      order: 0,
      is_active: true,
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing title and image', () => {
    const result = heroSliderSchema.safeParse({
      school_id: 1,
      title: '',
      image: '',
      order: 0,
      is_active: true,
    })

    expect(result.success).toBe(false)
  })
})
