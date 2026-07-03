import { z } from 'zod'

const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

export const editorLinkSchema = z
  .string()
  .trim()
  .min(1, 'URL wajib diisi.')
  .refine((value) => {
    if (value.startsWith('/') && !value.startsWith('//')) {
      return true
    }

    try {
      const url = new URL(value)
      return SAFE_LINK_PROTOCOLS.has(url.protocol)
    } catch {
      return false
    }
  }, 'URL tidak valid. Gunakan https://, mailto:, atau path relatif.')

export function parseYoutubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
      return trimmed
    }
  } catch {
    return null
  }

  return null
}
