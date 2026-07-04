import { describe, expect, it } from 'vitest'
import { documentSchema } from './document'

describe('documentSchema', () => {
  it('accepts valid document input', () => {
    const result = documentSchema.safeParse({
      school_id: 1,
      title: 'Brosur Pendaftaran',
      file_url: '/uploads/brosur.pdf',
    })

    expect(result.success).toBe(true)
  })

  it('applies defaults for optional fields', () => {
    const result = documentSchema.safeParse({
      school_id: 1,
      title: 'Formulir PMB',
      file_url: '/uploads/formulir.pdf',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.category).toBe('lainnya')
      expect(result.data.is_active).toBe(true)
      expect(result.data.order).toBe(0)
    }
  })

  it('rejects empty file_url', () => {
    const result = documentSchema.safeParse({
      school_id: 1,
      title: 'Dokumen Test',
      file_url: '',
    })

    expect(result.success).toBe(false)
  })

  it('rejects empty title', () => {
    const result = documentSchema.safeParse({
      school_id: 1,
      title: '',
      file_url: '/uploads/file.pdf',
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid category values', () => {
    for (const category of ['brosur', 'formulir', 'peraturan', 'kalender', 'lainnya']) {
      const result = documentSchema.safeParse({
        school_id: 1,
        title: 'Dokumen',
        file_url: '/uploads/file.pdf',
        category,
      })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid category', () => {
    const result = documentSchema.safeParse({
      school_id: 1,
      title: 'Dokumen',
      file_url: '/uploads/file.pdf',
      category: 'invalid',
    })

    expect(result.success).toBe(false)
  })
})
