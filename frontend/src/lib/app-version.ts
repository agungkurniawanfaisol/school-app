export interface ServerVersionInfo {
  version: string
  builtAt?: string | null
  gitSha?: string | null
}

const SEEN_KEY = 'nh-app-version-seen'

export function getBuildVersion(): string {
  return import.meta.env.VITE_APP_VERSION || '0.0.0'
}

export function getBuildGitSha(): string {
  return import.meta.env.VITE_GIT_SHA || ''
}

export function formatAppVersion(version = getBuildVersion()): string {
  return version.startsWith('v') ? version : `v${version}`
}

/** Compare semver-like strings (1.2.3). Returns 1 if a>b, -1 if a<b, 0 if equal/unparseable equal. */
export function compareSemver(a: string, b: string): number {
  const parse = (v: string) =>
    v
      .replace(/^v/i, '')
      .split('.')
      .map((part) => Number.parseInt(part.replace(/[^0-9].*$/, ''), 10) || 0)

  const pa = parse(a)
  const pb = parse(b)
  const len = Math.max(pa.length, pb.length)
  for (let i = 0; i < len; i += 1) {
    const left = pa[i] ?? 0
    const right = pb[i] ?? 0
    if (left > right) return 1
    if (left < right) return -1
  }
  return 0
}

export function getSeenVersion(): string | null {
  try {
    return localStorage.getItem(SEEN_KEY)
  } catch {
    return null
  }
}

export function setSeenVersion(version: string): void {
  try {
    localStorage.setItem(SEEN_KEY, version)
  } catch {
    /* ignore */
  }
}

/**
 * Notify only when the deployed server version is newer than the running bundle
 * and the user has not already acknowledged that server version.
 * Same/older server than the bundle → no toast (client is current or ahead).
 */
export function shouldNotifyUpdate(serverVersion: string, buildVersion = getBuildVersion()): boolean {
  if (compareSemver(serverVersion, buildVersion) <= 0) {
    return false
  }
  const seen = getSeenVersion()
  if (seen && compareSemver(serverVersion, seen) <= 0) {
    return false
  }
  return true
}

export async function fetchServerVersion(signal?: AbortSignal): Promise<ServerVersionInfo | null> {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return null
    const data = (await response.json()) as ServerVersionInfo
    if (!data?.version || typeof data.version !== 'string') return null
    return data
  } catch {
    return null
  }
}
