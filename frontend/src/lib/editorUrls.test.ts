import { describe, expect, it } from 'vitest'
import { editorLinkSchema, parseYoutubeEmbedUrl } from '@/lib/editorUrls'
import { validateUploadFile } from '@/lib/uploadValidation'

describe('editorUrls', () => {
  it('accepts safe https links', () => {
    expect(editorLinkSchema.safeParse('https://example.com/path').success).toBe(true)
  })

  it('rejects javascript links', () => {
    expect(editorLinkSchema.safeParse('javascript:alert(1)').success).toBe(false)
  })

  it('accepts valid youtube hosts only', () => {
    expect(parseYoutubeEmbedUrl('https://www.youtube.com/watch?v=abc')).toBeTruthy()
    expect(parseYoutubeEmbedUrl('https://youtu.be/abc')).toBeTruthy()
    expect(parseYoutubeEmbedUrl('https://evil-youtube.com/watch?v=abc')).toBeNull()
  })
})

describe('uploadValidation', () => {
  it('rejects unsupported image types', () => {
    const file = new File(['x'], 'test.svg', { type: 'image/svg+xml' })
    expect(validateUploadFile(file, 'image')).toMatch(/Format gambar/)
  })

  it('accepts png uploads', () => {
    const file = new File(['x'], 'test.png', { type: 'image/png' })
    expect(validateUploadFile(file, 'image')).toBeNull()
  })
})
