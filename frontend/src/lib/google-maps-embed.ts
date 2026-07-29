export const MAP_EMBED_URL_MAX = 2000

export function normalizeMapEmbedUrl(raw: string | null | undefined): string | null {
  if (raw == null) {
    return null
  }

  let value = raw.trim()
  if (!value) {
    return null
  }

  const srcMatch = value.match(/\bsrc\s*=\s*["']([^"']+)["']/i)
  if (srcMatch?.[1]) {
    value = srcMatch[1].trim()
  }

  return value || null
}

export function isAllowedMapEmbedUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') {
      return false
    }

    if (!/^(?:www\.)?(?:maps\.)?google\.(?:com|co\.\w+)$/i.test(parsed.hostname)) {
      return false
    }

    const path = parsed.pathname
    const query = parsed.search

    if (path.includes('/maps/embed')) {
      return true
    }

    return path.includes('/maps') && query.includes('output=embed')
  } catch {
    return false
  }
}
