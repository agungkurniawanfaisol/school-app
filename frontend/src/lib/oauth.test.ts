import { describe, expect, it } from 'vitest'
import { getGoogleOAuthStartUrl, getOAuthErrorMessage } from '@/lib/oauth'

describe('oauth helpers', () => {
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
})
