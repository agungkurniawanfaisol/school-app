/**
 * Build the API path that starts Google OAuth.
 * Always same-origin `/api/...` so the browser never hits Docker-internal
 * hosts (e.g. http://backend:8000 from VITE_API_PROXY_TARGET).
 * Vite/nginx proxies /api to the Laravel backend.
 */
export type GoogleOAuthIntent = 'admin' | 'pmb'

export function getGoogleOAuthStartUrl(intent: GoogleOAuthIntent = 'admin'): string {
  return `/api/admin/auth/google/redirect?intent=${intent}`
}

const GOOGLE_AUTH_ORIGIN = 'https://accounts.google.com'

/**
 * Activate a waiting service worker so /api OAuth callback is not intercepted
 * by an outdated NavigationRoute (missing /api denylist).
 */
export async function ensureServiceWorkerUpdated(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      return
    }

    await registration.update()

    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      await Promise.race([
        new Promise<void>((resolve) => {
          const onChange = () => {
            navigator.serviceWorker.removeEventListener('controllerchange', onChange)
            resolve()
          }
          navigator.serviceWorker.addEventListener('controllerchange', onChange)
        }),
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, 2000)
        }),
      ])
    }
  } catch {
    // OAuth can still proceed; worst case old SW still blocks callback.
  }
}

/**
 * Fetch the Google authorization URL as JSON instead of top-level navigating
 * to /api/... — Workbox NavigationRoute would otherwise serve SPA index.html
 * and dump users on the public landing page.
 */
export async function resolveGoogleOAuthUrl(intent: GoogleOAuthIntent = 'admin'): Promise<string> {
  await ensureServiceWorkerUpdated()

  const response = await fetch(`${getGoogleOAuthStartUrl(intent)}&format=json`, {
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
