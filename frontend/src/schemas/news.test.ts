import { describe, expect, it } from 'vitest'
import { newsSchema } from './news'

describe('newsSchema', () => {
  it('accepts valid news input', () => {
    const result = newsSchema.safeParse({
      school_id: 1,
      title: 'Judul Berita',
      slug: 'judul-berita',
      status: 'draft',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = newsSchema.safeParse({
      school_id: 1,
      title: '',
      slug: 'judul',
    })

    expect(result.success).toBe(false)
  })
})
