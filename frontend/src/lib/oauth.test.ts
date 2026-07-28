import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getGoogleOAuthStartUrl,
  getOAuthErrorMessage,
  resolveGoogleOAuthUrl,
} from '@/lib/oauth'

describe('oauth helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('builds Google OAuth start URL with proxy target when set', () => {
    expect(getGoogleOAuthStartUrl()).toContain('/api/admin/auth/google/redirect')
  })

  it('maps known oauth error codes to Indonesian messages', () => {
    expect(getOAuthErrorMessage('not_registered')).toBe(
      'Akun Google Anda belum terdaftar. Hubungi administrator.',
    )
    expect(getOAuthErrorMessage('access_denied')).toBe('Akses ditolak.')
    expect(getOAuthErrorMessage(null)).toBeNull()
  })

  it('resolves Google authorization URL via JSON fetch (avoids SW navigation)', async () => {
    const googleUrl =
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=test&state=abc'

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ url: googleUrl }),
      }),
    )
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { serviceWorker: undefined },
    })

    await expect(resolveGoogleOAuthUrl()).resolves.toBe(googleUrl)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/auth/google/redirect?format=json'),
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    )
  })

  it('rejects non-Google authorization URLs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ url: 'https://evil.example/phish' }),
      }),
    )

    await expect(resolveGoogleOAuthUrl()).rejects.toThrow(/oauth/i)
  })
})
