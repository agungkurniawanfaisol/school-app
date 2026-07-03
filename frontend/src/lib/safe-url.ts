const DANGEROUS_PROTOCOL = /^(javascript|data|vbscript):/i

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

export function resolveAssetUrl(url: string | null | undefined, fallback: string): string {
  const trimmed = url?.trim()
  if (!trimmed || DANGEROUS_PROTOCOL.test(trimmed)) {
    return fallback
  }
  if (isSafeRelativePath(trimmed) || isSafeHttpUrl(trimmed)) {
    return trimmed
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

export function buildTeacherSharePath(uuid: string): string {
  return `/guru/detail/${uuid}`
}
