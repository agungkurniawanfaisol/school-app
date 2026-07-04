import type { LucideIcon } from 'lucide-react'
import {
  Building2, ClipboardList, Compass, GraduationCap, Info,
  Newspaper, Sparkles, Star, Users, Search,
} from 'lucide-react'

export type NavLink = {
  label: string
  href: string
  icon?: LucideIcon
}

export type NavGroup = {
  label: string
  icon?: LucideIcon
  children: NavLink[]
}

export type NavStandalone = NavLink & { standalone: true }

export type NavEntry = NavGroup | NavStandalone

export function isNavStandalone(entry: NavEntry): entry is NavStandalone {
  return 'standalone' in entry && entry.standalone === true
}

export const mainNavTree: NavEntry[] = [
  {
    label: 'Profil',
    icon: Info,
    children: [
      { label: 'Tentang', href: '/#tentang', icon: Info },
      { label: 'Program Unggulan', href: '/program-unggulan', icon: Star },
      { label: 'Guru', href: '/#guru', icon: Users },
      { label: 'Fasilitas', href: '/fasilitas', icon: Building2 },
    ],
  },
  {
    label: 'Tur Virtual',
    href: '/tur-virtual',
    icon: Compass,
    standalone: true,
  },
  {
    label: 'Konten',
    icon: Newspaper,
    children: [
      { label: 'Kegiatan', href: '/kegiatan', icon: Sparkles },
      { label: 'Berita', href: '/berita', icon: Newspaper },
    ],
  },
  {
    label: 'PMB',
    icon: GraduationCap,
    children: [
      { label: 'Informasi PMB', href: '/pmb', icon: GraduationCap },
      { label: 'Daftar Siswa Baru', href: '/pmb/daftar', icon: ClipboardList },
      { label: 'Cek Status', href: '/pmb/status', icon: Search },
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
