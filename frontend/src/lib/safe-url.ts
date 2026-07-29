const DANGEROUS_PROTOCOL = /^(javascript|data|vbscript):/i
const DOCKER_INTERNAL_HOSTS = new Set(['backend', 'nginx', 'frontend'])

export function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export function isSafeRelativePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !DANGEROUS_PROTOCOL.test(path)
}

export function isSafeBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'blob:'
  } catch {
    return false
  }
}

/** Convert docker-internal absolute API/storage URLs to same-origin relative paths. */
export function toBrowserAssetUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const isApiOrStorage =
      parsed.pathname.startsWith('/api/') || parsed.pathname.startsWith('/storage/')
    if (!isApiOrStorage) {
      return url
    }

    const host = parsed.hostname.toLowerCase()
    if (DOCKER_INTERNAL_HOSTS.has(host) || host === 'localhost' || host === '127.0.0.1') {
      return `${parsed.pathname}${parsed.search}`
    }

    return url
  } catch {
    return url
  }
}

export function resolveAssetUrl(url: string | null | undefined, fallback: string): string {
  const trimmed = url?.trim()
  if (!trimmed || DANGEROUS_PROTOCOL.test(trimmed)) {
    return fallback
  }
  if (isSafeRelativePath(trimmed) || isSafeBlobUrl(trimmed)) {
    return trimmed
  }
  if (isSafeHttpUrl(trimmed)) {
    return toBrowserAssetUrl(trimmed)
  }
  return fallback
}

export type SocialNetwork = 'facebook' | 'instagram' | 'youtube'

export function resolveSocialHref(raw: string, network: SocialNetwork): string | null {
  const trimmed = raw.trim()
  if (!trimmed || DANGEROUS_PROTOCOL.test(trimmed)) {
    return null
  }

  if (isSafeRelativePath(trimmed) || isSafeHttpUrl(trimmed)) {
    return trimmed
  }

  if (network === 'instagram') {
    const handle = trimmed.replace(/^@/, '')
    if (!/^[\w.-]+$/.test(handle)) {
      return null
    }
    return `https://instagram.com/${handle}`
  }

  return null
}

export function resolveMailto(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed || DANGEROUS_PROTOCOL.test(trimmed)) {
    return null
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(trimmed)) {
    return null
  }
  return `mailto:${trimmed}`
}

/** Safe href for user-controlled links (relative path or http(s) only). */
export function resolveSafeHref(url: string | null | undefined): string | null {
  const trimmed = url?.trim()
  if (!trimmed || DANGEROUS_PROTOCOL.test(trimmed)) {
    return null
  }
  if (isSafeRelativePath(trimmed) || isSafeHttpUrl(trimmed)) {
    return trimmed
  }
  return null
}

export function buildTeacherSharePath(uuid: string): string {
  return `/guru/detail/${uuid}`
}
