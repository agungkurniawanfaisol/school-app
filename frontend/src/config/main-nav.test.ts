import { describe, expect, it } from 'vitest'
import { isInternalRoute, mainNavTree, resolveNavHref } from '@/config/main-nav'

describe('main-nav', () => {
  it('groups navigation into tree structure with PMB', () => {
    const labels = mainNavTree.map((group) => group.label)
    expect(labels).toEqual(['Profil', 'Konten', 'PMB'])

    const pmbLinks = mainNavTree.find((group) => group.label === 'PMB')?.children
    expect(pmbLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/pmb' }),
        expect.objectContaining({ href: '/pmb/daftar' }),
        expect.objectContaining({ href: '/pmb/status' }),
      ]),
    )
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
