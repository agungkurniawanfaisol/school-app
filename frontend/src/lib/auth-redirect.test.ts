import { describe, expect, it } from 'vitest'
import { getAuthHomePath, getAuthHomePathForUser, resolvePostLoginPath } from '@/lib/auth-redirect'

describe('auth-redirect', () => {
  it('maps roles to home paths', () => {
    expect(getAuthHomePath('pendaftar')).toBe('/pmb/daftar')
    expect(getAuthHomePath('admin_pmb')).toBe('/admin/pmb-registrations')
    expect(getAuthHomePath('guru')).toBe('/admin/profile')
    expect(getAuthHomePath('admin')).toBe('/admin')
  })

  it('falls back to login when user is missing', () => {
    expect(getAuthHomePathForUser(null)).toBe('/admin/login')
    expect(getAuthHomePathForUser(undefined)).toBe('/admin/login')
  })

  it('uses role for authenticated users', () => {
    expect(
      getAuthHomePathForUser({
        id: 1,
        name: 'Wali',
        email: 'wali@test.id',
        role: 'pendaftar',
      }),
    ).toBe('/pmb/daftar')
  })

  it('uses redirect for pendaftar when safe', () => {
    expect(
      resolvePostLoginPath(
        { id: 1, name: 'Wali', email: 'wali@test.id', role: 'pendaftar' },
        '/pmb/daftar',
      ),
    ).toBe('/pmb/daftar')
  })

  it('ignores unsafe redirect paths', () => {
    expect(
      resolvePostLoginPath(
        { id: 1, name: 'Admin', email: 'admin@test.id', role: 'admin' },
        '//evil.test',
      ),
    ).toBe('/admin')
  })
})
