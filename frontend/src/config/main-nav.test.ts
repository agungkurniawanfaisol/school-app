import { describe, expect, it } from 'vitest'
import { isNavStandalone, mainNavTree } from '@/config/main-nav'

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

  it('contains hash links for homepage sections', () => {
    const profile = mainNavTree.find((e) => e.label === 'nav.profile')!
    if (!isNavStandalone(profile)) {
      const hashLinks = profile.children.filter((c) => c.href.startsWith('/#'))
      expect(hashLinks.length).toBeGreaterThan(0)
      expect(hashLinks[0].href).toBe('/#tentang')
    }
  })
})
