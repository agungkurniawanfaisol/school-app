import { describe, expect, it } from 'vitest'
import {
  findActiveAdminNavGroup,
  getAdminBreadcrumbs,
  getAdminGroupDefaultHref,
  getAdminNavForRole,
  isAdminNavActive,
  isGuruAllowedPath,
} from '@/config/admin-nav'

describe('admin-nav', () => {
  it('isAdminNavActive matches dashboard exactly', () => {
    expect(isAdminNavActive('/admin', '/admin', true)).toBe(true)
    expect(isAdminNavActive('/admin/news', '/admin', true)).toBe(false)
  })

  it('isAdminNavActive matches nested routes with startsWith', () => {
    expect(isAdminNavActive('/admin/news', '/admin/news')).toBe(true)
    expect(isAdminNavActive('/admin/news/create', '/admin/news')).toBe(true)
    expect(isAdminNavActive('/admin/teachers', '/admin/news')).toBe(false)
  })

  it('findActiveAdminNavGroup returns group for active route', () => {
    expect(findActiveAdminNavGroup('/admin/news')).toBe('Konten')
    expect(findActiveAdminNavGroup('/admin/teachers')).toBe('Profil')
    expect(findActiveAdminNavGroup('/admin')).toBeNull()
  })

  it('getAdminBreadcrumbs builds trail for list pages', () => {
    expect(getAdminBreadcrumbs('/admin/news')).toEqual([
      { label: 'Admin', href: '/admin' },
      { label: 'Konten' },
      { label: 'Berita' },
    ])
    expect(getAdminBreadcrumbs('/admin')).toEqual([
      { label: 'Admin', href: '/admin' },
      { label: 'Dashboard' },
    ])
  })

  it('getAdminGroupDefaultHref returns default page per group', () => {
    expect(getAdminGroupDefaultHref('Konten')).toBe('/admin/news')
    expect(getAdminGroupDefaultHref('Profil')).toBe('/admin/teachers')
    expect(getAdminGroupDefaultHref('PMB')).toBe('/admin/pmb-registrations')
    expect(getAdminGroupDefaultHref('Sistem')).toBe('/admin/settings')
    expect(getAdminGroupDefaultHref('Unknown')).toBeNull()
  })

  it('getAdminNavForRole limits guru navigation', () => {
    const guruNav = getAdminNavForRole('guru')
    expect(guruNav.showDashboard).toBe(false)
    expect(guruNav.groups).toHaveLength(0)
    expect(guruNav.profileItem?.href).toBe('/admin/profile')

    const adminNav = getAdminNavForRole('admin')
    expect(adminNav.showDashboard).toBe(true)
    expect(adminNav.groups.length).toBeGreaterThan(0)
  })

  it('isGuruAllowedPath only allows profile route', () => {
    expect(isGuruAllowedPath('/admin/profile')).toBe(true)
    expect(isGuruAllowedPath('/admin/news')).toBe(false)
  })
})
