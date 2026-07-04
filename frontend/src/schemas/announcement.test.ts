import { describe, expect, it } from 'vitest'
import { announcementSchema } from './announcement'

describe('announcementSchema', () => {
  it('accepts valid announcement input', () => {
    const result = announcementSchema.safeParse({
      school_id: 1,
      title: 'Pengumuman Libur',
      content: 'Sekolah libur pada tanggal 17 Agustus.',
    })

    expect(result.success).toBe(true)
  })

  it('applies defaults for optional fields', () => {
    const result = announcementSchema.safeParse({
      school_id: 1,
      title: 'Info Penting',
      content: 'Detail pengumuman.',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.priority).toBe('normal')
      expect(result.data.is_pinned).toBe(false)
      expect(result.data.is_active).toBe(true)
      expect(result.data.order).toBe(0)
    }
  })

  it('rejects empty title', () => {
    const result = announcementSchema.safeParse({
      school_id: 1,
      title: '',
      content: 'Konten pengumuman.',
    })

    expect(result.success).toBe(false)
  })

  it('rejects empty content', () => {
    const result = announcementSchema.safeParse({
      school_id: 1,
      title: 'Judul',
      content: '',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid priority', () => {
    const result = announcementSchema.safeParse({
      school_id: 1,
      title: 'Judul',
      content: 'Konten',
      priority: 'low',
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid priority values', () => {
    for (const priority of ['normal', 'important', 'urgent']) {
      const result = announcementSchema.safeParse({
        school_id: 1,
        title: 'Judul',
        content: 'Konten',
        priority,
      })
      expect(result.success).toBe(true)
    }
  })
})
