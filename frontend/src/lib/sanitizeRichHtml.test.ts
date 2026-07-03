import { describe, expect, it } from 'vitest'
import { sanitizeRichHtml } from '@/lib/sanitizeRichHtml'

describe('sanitizeRichHtml', () => {
  it('removes script tags', () => {
    expect(sanitizeRichHtml('<p>ok</p><script>x</script>')).toBe('<p>ok</p>')
  })

  it('unwraps javascript links', () => {
    expect(sanitizeRichHtml('<a href="javascript:alert(1)">Click</a>')).toBe('Click')
  })

  it('adds noopener when link opens in new tab', () => {
    const result = sanitizeRichHtml('<a href="https://example.com" target="_blank">Link</a>')
    expect(result).toContain('rel="noopener noreferrer"')
  })

  it('adds noopener to external https links', () => {
    const result = sanitizeRichHtml('<a href="https://example.com">Link</a>')
    expect(result).toContain('rel="noopener noreferrer"')
  })

  it('keeps image alignment attribute', () => {
    const html = '<img src="/storage/x.png" data-align="center" class="rounded-lg" />'
    expect(sanitizeRichHtml(html)).toContain('data-align="center"')
  })

  it('prevents iframe focus stealing with tabindex and lazy loading', () => {
    const html =
      '<iframe src="https://www.youtube-nocookie.com/embed/abc123" width="640" height="360"></iframe>'
    const result = sanitizeRichHtml(html)
    expect(result).toContain('tabindex="-1"')
    expect(result).toContain('loading="lazy"')
  })
})
