import { describe, expect, it } from 'vitest'
import { isInternalRoute, isNavStandalone, mainNavTree, resolveNavHref } from '@/config/main-nav'

describe('main-nav', () => {
  it('groups navigation into tree with standalone Tur Virtual', () => {
    const labels = mainNavTree.map((entry) => entry.label)
    expect(labels).toEqual(['nav.profile', 'nav.virtualTour', 'nav.content', 'nav.pmb'])

    const turVirtual = mainNavTree.find((e) => e.label === 'nav.virtualTour')!
    expect(isNavStandalone(turVirtual)).toBe(true)
    if (isNavStandalone(turVirtual)) {
      expect(turVirtual.href).toBe('/tur-virtual')
    }

    const pmbEntry = mainNavTree.find((e) => e.label === 'nav.pmb')!
    expect(isNavStandalone(pmbEntry)).toBe(false)
    if (!isNavStandalone(pmbEntry)) {
      expect(pmbEntry.children).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ href: '/pmb' }),
          expect.objectContaining({ href: '/pmb/daftar' }),
          expect.objectContaining({ href: '/pmb/status' }),
        ]),
      )
    }
  })

  it('resolves home anchor links without leading slash', () => {
    expect(resolveNavHref('/#tentang', true)).toBe('#tentang')
    expect(resolveNavHref('/#tentang', false)).toBe('/#tentang')
  })

  it('identifies internal routes', () => {
    expect(isInternalRoute('/kursus')).toBe(true)
    expect(isInternalRoute('/program-unggulan')).toBe(true)
    expect(isInternalRoute('/fasilitas')).toBe(true)
    expect(isInternalRoute('/pmb/daftar')).toBe(true)
    expect(isInternalRoute('/berita')).toBe(true)
    expect(isInternalRoute('/kegiatan')).toBe(true)
    expect(isInternalRoute('/#berita')).toBe(false)
  })
})
