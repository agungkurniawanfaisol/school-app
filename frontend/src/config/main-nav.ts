export type NavLink = {
  label: string
  href: string
}

export type NavGroup = {
  label: string
  children: NavLink[]
}

export const mainNavTree: NavGroup[] = [
  {
    label: 'Profil',
    children: [
      { label: 'Tentang', href: '/#tentang' },
      { label: 'Program Unggulan', href: '/program-unggulan' },
      { label: 'Guru', href: '/#guru' },
      { label: 'Fasilitas', href: '/fasilitas' },
      { label: 'Tur Virtual', href: '/tur-virtual' },
    ],
  },
  {
    label: 'Konten',
    children: [
      { label: 'Kegiatan', href: '/kegiatan' },
      { label: 'Berita', href: '/berita' },
      { label: 'Kursus', href: '/kursus' },
    ],
  },
  {
    label: 'PMB',
    children: [
      { label: 'Informasi PMB', href: '/pmb' },
      { label: 'Daftar Siswa Baru', href: '/pmb/daftar' },
      { label: 'Cek Status', href: '/pmb/status' },
    ],
  },
]

export function resolveNavHref(href: string, isHome: boolean): string {
  if (isHome && href.startsWith('/#')) {
    return href.replace('/', '')
  }
  return href
}

export function isInternalRoute(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('/#')
}
