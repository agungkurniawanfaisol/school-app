/**
 * Build the backend URL that starts Google OAuth for admin login.
 * In dev, Vite proxies /api but OAuth redirect must hit the real API host.
 */
export function getGoogleOAuthStartUrl(): string {
  const proxyTarget = import.meta.env.VITE_API_PROXY_TARGET as string | undefined
  const base = proxyTarget?.replace(/\/$/, '') ?? ''

  return `${base}/api/admin/auth/google/redirect`
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
