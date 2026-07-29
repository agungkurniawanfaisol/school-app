import { describe, expect, it } from 'vitest'
import {
  findActiveAdminNavGroup,
  getAdminBreadcrumbs,
  getAdminGroupDefaultHref,
  getAdminNavForRole,
  isAdminNavActive,
  isGuruAllowedPath,
  isAdminPmbAllowedPath,
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
    expect(findActiveAdminNavGroup('/admin/news')).toBe('nav.group.content')
    expect(findActiveAdminNavGroup('/admin/teachers')).toBe('nav.group.profile')
    expect(findActiveAdminNavGroup('/admin')).toBeNull()
  })

  it('getAdminBreadcrumbs builds trail for list pages', () => {
    expect(getAdminBreadcrumbs('/admin/news')).toEqual([
      { labelKey: 'nav.admin', href: '/admin' },
      { labelKey: 'nav.group.content' },
      { labelKey: 'nav.news' },
    ])
    expect(getAdminBreadcrumbs('/admin')).toEqual([
      { labelKey: 'nav.admin', href: '/admin' },
      { labelKey: 'nav.dashboard' },
    ])
    expect(getAdminBreadcrumbs('/admin/statistik-sekolah')).toEqual([
      { labelKey: 'nav.admin', href: '/admin' },
      { labelKey: 'nav.group.system' },
      { labelKey: 'nav.schoolStats', href: '/admin/statistik-sekolah' },
    ])
  })

  it('getAdminGroupDefaultHref returns default page per group', () => {
    expect(getAdminGroupDefaultHref('nav.group.content')).toBe('/admin/news')
    expect(getAdminGroupDefaultHref('nav.group.profile')).toBe('/admin/teachers')
    expect(getAdminGroupDefaultHref('nav.group.pmb')).toBe('/admin/pmb-registrations')
    expect(getAdminGroupDefaultHref('nav.group.system')).toBe('/admin/settings')
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

  it('limits admin PMB navigation to PMB and profile', () => {
    const nav = getAdminNavForRole('admin_pmb')
    expect(nav.showDashboard).toBe(false)
    expect(nav.groups).toHaveLength(1)
    expect(nav.groups[0]?.labelKey).toBe('nav.group.pmb')
    expect(isAdminPmbAllowedPath('/admin/pmb-registrations/example')).toBe(true)
    expect(isAdminPmbAllowedPath('/admin/pmb-fees')).toBe(true)
    expect(isAdminPmbAllowedPath('/admin/news')).toBe(false)
  })
})
