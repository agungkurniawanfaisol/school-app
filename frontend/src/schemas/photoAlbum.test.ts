import { describe, expect, it } from 'vitest'
import { photoAlbumSchema, albumPhotoSchema } from './photoAlbum'

describe('albumPhotoSchema', () => {
  it('accepts valid photo entry', () => {
    const result = albumPhotoSchema.safeParse({
      url: 'https://example.com/photo.jpg',
      caption: 'Kegiatan pramuka',
      order: 1,
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty url', () => {
    const result = albumPhotoSchema.safeParse({
      url: '',
      caption: null,
      order: 0,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.url).toBeDefined()
    }
  })

  it('rejects url exceeding max length', () => {
    const result = albumPhotoSchema.safeParse({
      url: 'a'.repeat(501),
    })

    expect(result.success).toBe(false)
  })

  it('rejects caption exceeding max length', () => {
    const result = albumPhotoSchema.safeParse({
      url: 'https://example.com/photo.jpg',
      caption: 'a'.repeat(301),
    })

    expect(result.success).toBe(false)
  })
})

describe('photoAlbumSchema', () => {
  it('accepts valid album input', () => {
    const result = photoAlbumSchema.safeParse({
      school_id: 1,
      title: 'Album Kegiatan Pramuka',
      photos: [
        { url: 'https://example.com/1.jpg', caption: 'Foto 1', order: 0 },
      ],
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    const result = photoAlbumSchema.safeParse({
      school_id: 1,
      title: '',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid school_id', () => {
    const result = photoAlbumSchema.safeParse({
      school_id: 0,
      title: 'Test Album',
    })

    expect(result.success).toBe(false)
  })

  it('accepts minimal valid input with defaults', () => {
    const result = photoAlbumSchema.safeParse({
      school_id: 1,
      title: 'Album Sederhana',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.is_active).toBe(true)
      expect(result.data.order).toBe(0)
      expect(result.data.photos).toEqual([])
    }
  })

  it('rejects title exceeding max length', () => {
    const result = photoAlbumSchema.safeParse({
      school_id: 1,
      title: 'a'.repeat(201),
    })

    expect(result.success).toBe(false)
  })

  it('accepts nullable optional fields', () => {
    const result = photoAlbumSchema.safeParse({
      school_id: 1,
      title: 'Album Valid',
      description: null,
      cover_image: null,
      event_date: null,
      slug: null,
    })

    expect(result.success).toBe(true)
  })
})
