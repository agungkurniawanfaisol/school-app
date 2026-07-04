import type { LucideIcon } from 'lucide-react'
import {
  Award, Building2, CalendarDays, ClipboardList, Compass, Dumbbell, FileText,
  GraduationCap, Images, Info, MessageSquare, Newspaper, Sparkles,
  Star, Users, Search,
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
    label: 'nav.profile',
    icon: Info,
    children: [
      { label: 'nav.about', href: '/#tentang', icon: Info },
      { label: 'nav.featuredPrograms', href: '/program-unggulan', icon: Star },
      { label: 'nav.teachers', href: '/#guru', icon: Users },
      { label: 'nav.facilities', href: '/fasilitas', icon: Building2 },
      { label: 'nav.achievements', href: '/prestasi', icon: Award },
      { label: 'nav.gallery', href: '/galeri', icon: Images },
      { label: 'nav.extracurricular', href: '/ekstrakurikuler', icon: Dumbbell },
    ],
  },
  {
    label: 'nav.virtualTour',
    href: '/tur-virtual',
    icon: Compass,
    standalone: true,
  },
  {
    label: 'nav.content',
    icon: Newspaper,
    children: [
      { label: 'nav.activities', href: '/kegiatan', icon: Sparkles },
      { label: 'nav.news', href: '/berita', icon: Newspaper },
      { label: 'nav.agenda', href: '/agenda', icon: CalendarDays },
      { label: 'nav.documents', href: '/#dokumen', icon: FileText },
      { label: 'nav.suggestion', href: '/kotak-saran', icon: MessageSquare },
    ],
  },
  {
    label: 'nav.pmb',
    icon: GraduationCap,
    children: [
      { label: 'nav.pmbInfo', href: '/pmb', icon: GraduationCap },
      { label: 'nav.registerNew', href: '/pmb/daftar', icon: ClipboardList },
      { label: 'nav.checkStatus', href: '/pmb/status', icon: Search },
    ],
  },
]

