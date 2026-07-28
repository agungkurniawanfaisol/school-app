/**
 * Build the backend URL that starts Google OAuth for admin login.
 * In dev, Vite proxies /api but OAuth redirect must hit the real API host.
 */
export function getGoogleOAuthStartUrl(): string {
  const proxyTarget = import.meta.env.VITE_API_PROXY_TARGET as string | undefined
  const base = proxyTarget?.replace(/\/$/, '') ?? ''

  return `${base}/api/admin/auth/google/redirect`
}

const GOOGLE_AUTH_ORIGIN = 'https://accounts.google.com'

/**
 * Fetch the Google authorization URL as JSON instead of top-level navigating
 * to /api/... — Workbox NavigationRoute would otherwise serve SPA index.html
 * and dump users on the public landing page.
 */
export async function resolveGoogleOAuthUrl(): Promise<string> {
  const response = await fetch(`${getGoogleOAuthStartUrl()}?format=json`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  })

  if (!response.ok) {
    throw new Error('oauth_failed')
  }

  const data: unknown = await response.json()
  const url =
    typeof data === 'object' && data !== null && 'url' in data && typeof data.url === 'string'
      ? data.url
      : null

  if (!url || !isAllowedGoogleAuthorizationUrl(url)) {
    throw new Error('oauth_failed')
  }

  return url
}

export function isAllowedGoogleAuthorizationUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.origin === GOOGLE_AUTH_ORIGIN && parsed.pathname.startsWith('/o/oauth2/')
  } catch {
    return false
  }
}

export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  not_registered: 'Akun Google Anda belum terdaftar. Hubungi administrator.',
  access_denied: 'Akses ditolak.',
  oauth_failed: 'Login Google gagal. Silakan coba lagi.',
}

export function getOAuthErrorMessage(code: string | null): string | null {
  if (!code) {
    return null
  }

  return OAUTH_ERROR_MESSAGES[code] ?? 'Login Google gagal. Silakan coba lagi.'
}
