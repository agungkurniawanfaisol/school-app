import { describe, expect, it } from 'vitest'
import {
  isAllowedMapEmbedUrl,
  normalizeMapEmbedUrl,
} from '@/lib/google-maps-embed'

describe('google-maps-embed', () => {
  it('extracts src from iframe html', () => {
    const iframe =
      '<iframe src="https://www.google.com/maps/embed?pb=abc123" width="600" height="450"></iframe>'

    expect(normalizeMapEmbedUrl(iframe)).toBe('https://www.google.com/maps/embed?pb=abc123')
  })

  it('accepts google embed urls', () => {
    expect(isAllowedMapEmbedUrl('https://www.google.com/maps/embed?pb=!1m18')).toBe(true)
    expect(isAllowedMapEmbedUrl('https://maps.google.com/maps?q=-6.26,106.78&output=embed')).toBe(true)
  })

  it('rejects share links and place pages', () => {
    expect(isAllowedMapEmbedUrl('https://maps.app.goo.gl/Abc123')).toBe(false)
    expect(isAllowedMapEmbedUrl('https://www.google.com/maps/place/Jakarta')).toBe(false)
  })
})
