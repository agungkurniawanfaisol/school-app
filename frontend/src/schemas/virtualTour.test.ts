import { describe, expect, it } from 'vitest'
import { virtualTourFormSchema } from '@/schemas/virtualTour'

describe('virtualTourFormSchema', () => {
  it('accepts valid tour payload', () => {
    const result = virtualTourFormSchema.safeParse({
      school_id: 1,
      title: 'Tur Sekolah',
      is_active: true,
      order: 0,
      start_scene_uuid: '11111111-1111-4111-8111-111111111111',
      scenes: [
        {
          uuid: '11111111-1111-4111-8111-111111111111',
          title: 'Halaman Depan',
          image: '/storage/a.jpg',
          initial_pitch: 0,
          initial_yaw: 0,
          order: 0,
          hotspots: [],
        },
      ],
    })

    expect(result.success).toBe(true)
  })

  it('rejects tour without scenes', () => {
    const result = virtualTourFormSchema.safeParse({
      school_id: 1,
      title: 'Tur Sekolah',
      scenes: [],
    })

    expect(result.success).toBe(false)
  })
})
