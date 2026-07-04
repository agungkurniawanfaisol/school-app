import type { LucideIcon } from 'lucide-react'
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  Compass,
  FileDown,
  FileImage,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  Image,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Megaphone,
  Newspaper,
  School,
  Settings,
  Sparkles,
  Star,
  Target,
  Users,
  UserCog,
  UserRound,
} from 'lucide-react'
import type { UserRole } from '@/types'

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

export type AdminNavGroup = {
  label: string
  icon: LucideIcon
  defaultHref: string
  children: AdminNavItem[]
}

export const adminDashboardItem: AdminNavItem = {
  label: 'Dashboard',
  href: '/admin',
  icon: LayoutDashboard,
  exact: true,
}

export const guruProfileItem: AdminNavItem = {
  label: 'Profil Saya',
  href: '/admin/profile',
  icon: UserCog,
  exact: true,
}

export const adminNavTree: AdminNavGroup[] = [
  {
    label: 'Konten',
    icon: FolderOpen,
    defaultHref: '/admin/news',
    children: [
      { label: 'Berita', href: '/admin/news', icon: Newspaper },
      { label: 'Pengumuman', href: '/admin/announcements', icon: Megaphone },
      { label: 'Galeri Foto', href: '/admin/photo-albums', icon: ImageIcon },
      { label: 'Carousel Beranda', href: '/admin/hero-sliders', icon: Image },
      { label: 'Tur Virtual', href: '/admin/virtual-tours', icon: Compass },
      { label: 'Testimoni', href: '/admin/testimonials', icon: Star },
    ],
  },
  {
    label: 'Akademik',
    icon: BookOpen,
    defaultHref: '/admin/program-unggulan',
    children: [
      { label: 'Program Unggulan', href: '/admin/program-unggulan', icon: GraduationCap },
      { label: 'Kegiatan Siswa', href: '/admin/student-activities', icon: Sparkles },
      { label: 'Ekstrakurikuler', href: '/admin/extracurriculars', icon: Users },
      { label: 'Prestasi', href: '/admin/achievements', icon: Award },
      { label: 'Agenda', href: '/admin/events', icon: Calendar },
    ],
  },
  {
    label: 'Profil',
    icon: UserRound,
    defaultHref: '/admin/teachers',
    children: [
      { label: 'Guru', href: '/admin/teachers', icon: Users },
      { label: 'Fasilitas', href: '/admin/facilities', icon: Building2 },
      { label: 'Dokumen Unduhan', href: '/admin/documents', icon: FileDown },
    ],
  },
  {
    label: 'PMB',
    icon: GraduationCap,
    defaultHref: '/admin/pmb-registrations',
    children: [
      { label: 'Pendaftaran', href: '/admin/pmb-registrations', icon: GraduationCap },
      { label: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
    ],
  },
  {
    label: 'Sistem',
    icon: Settings,
    defaultHref: '/admin/settings',
    children: [
      { label: 'Data Sekolah', href: '/admin/schools', icon: School },
      { label: 'Visi & Misi', href: '/admin/vision-mission', icon: Target },
      { label: 'Media', href: '/admin/media', icon: FileImage },
      { label: 'Kontak Masuk', href: '/admin/contact-messages', icon: Mail },
      { label: 'Pengguna', href: '/admin/users', icon: UserCog },
      { label: 'Pengaturan', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function isAdminNavActive(pathname: string, href: string, exact = false): boolean {
  if (exact || href === '/admin') {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function findActiveAdminNavGroup(pathname: string): string | null {
  for (const group of adminNavTree) {
    if (group.children.some((item) => isAdminNavActive(pathname, item.href, item.exact))) {
      return group.label
    }
  }
  return null
}

export function getAdminNavForRole(role: UserRole | string) {
  if (role === 'guru') {
    return {
      showDashboard: false,
      groups: [] as AdminNavGroup[],
      profileItem: guruProfileItem,
    }
  }

  return {
    showDashboard: true,
    groups: adminNavTree,
    profileItem: guruProfileItem,
  }
}

export function isGuruAllowedPath(pathname: string): boolean {
  return pathname === '/admin/profile'
}

export function getAdminBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const crumbs: { label: string; href?: string }[] = [{ label: 'Admin', href: '/admin' }]

  if (pathname === '/admin') {
    crumbs.push({ label: 'Dashboard' })
    return crumbs
  }

  if (pathname === '/admin/profile') {
    crumbs.push({ label: 'Profil Saya' })
    return crumbs
  }

  if (pathname.startsWith('/admin/users')) {
    crumbs.push({ label: 'Sistem' })
    if (pathname === '/admin/users/create') {
      crumbs.push({ label: 'Tambah Pengguna' })
    } else if (pathname.includes('/edit')) {
      crumbs.push({ label: 'Edit Pengguna' })
    } else {
      crumbs.push({ label: 'Pengguna' })
    }
    return crumbs
  }

  if (pathname.startsWith('/admin/virtual-tours')) {
    crumbs.push({ label: 'Konten' }, { label: 'Tur Virtual', href: '/admin/virtual-tours' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/hero-sliders')) {
    crumbs.push({ label: 'Konten' }, { label: 'Carousel Beranda' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/testimonials')) {
    crumbs.push({ label: 'Konten' }, { label: 'Testimoni' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/announcements')) {
    crumbs.push({ label: 'Konten' }, { label: 'Pengumuman', href: '/admin/announcements' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/photo-albums')) {
    crumbs.push({ label: 'Konten' }, { label: 'Galeri Foto', href: '/admin/photo-albums' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/program-unggulan') || pathname.startsWith('/admin/curriculums')) {
    crumbs.push({ label: 'Akademik' }, { label: 'Program Unggulan', href: '/admin/program-unggulan' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/student-activities')) {
    crumbs.push({ label: 'Akademik' }, { label: 'Kegiatan Siswa', href: '/admin/student-activities' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/extracurriculars')) {
    crumbs.push({ label: 'Akademik' }, { label: 'Ekstrakurikuler', href: '/admin/extracurriculars' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/achievements')) {
    crumbs.push({ label: 'Akademik' }, { label: 'Prestasi', href: '/admin/achievements' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/events')) {
    crumbs.push({ label: 'Akademik' }, { label: 'Agenda', href: '/admin/events' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/teachers')) {
    crumbs.push({ label: 'Profil' }, { label: 'Guru', href: '/admin/teachers' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    else if (pathname.includes('/preview')) crumbs.push({ label: 'Pratinjau' })
    else if (pathname.match(/\/teachers\/[^/]+$/)) crumbs.push({ label: 'Detail' })
    return crumbs
  }

  if (pathname.startsWith('/admin/documents')) {
    crumbs.push({ label: 'Profil' }, { label: 'Dokumen Unduhan', href: '/admin/documents' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/faqs')) {
    crumbs.push({ label: 'PMB' }, { label: 'FAQ', href: '/admin/faqs' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/pmb-registrations')) {
    crumbs.push({ label: 'PMB' }, { label: 'Pendaftaran' })
    if (pathname !== '/admin/pmb-registrations') crumbs.push({ label: 'Detail' })
    return crumbs
  }

  if (pathname.startsWith('/admin/schools')) {
    crumbs.push({ label: 'Sistem' }, { label: 'Data Sekolah' })
    if (pathname.endsWith('/create')) crumbs.push({ label: 'Tambah' })
    else if (pathname.includes('/edit')) crumbs.push({ label: 'Edit' })
    return crumbs
  }

  if (pathname === '/admin/vision-mission') {
    crumbs.push({ label: 'Sistem' }, { label: 'Visi & Misi' })
    return crumbs
  }

  if (pathname === '/admin/media') {
    crumbs.push({ label: 'Sistem' }, { label: 'Media' })
    return crumbs
  }

  if (pathname.startsWith('/admin/contact-messages')) {
    crumbs.push({ label: 'Sistem' }, { label: 'Kontak Masuk', href: '/admin/contact-messages' })
    if (pathname !== '/admin/contact-messages') crumbs.push({ label: 'Detail' })
    return crumbs
  }

  if (pathname === '/admin/settings') {
    crumbs.push({ label: 'Sistem' }, { label: 'Pengaturan' })
    return crumbs
  }

  for (const group of adminNavTree) {
    const match = group.children.find((item) => isAdminNavActive(pathname, item.href, item.exact))
    if (match) {
      crumbs.push({ label: group.label })
      crumbs.push({ label: match.label })
      return crumbs
    }
  }

  crumbs.push({ label: 'Halaman' })
  return crumbs
}

export function findAdminNavItem(pathname: string): AdminNavItem | null {
  if (isAdminNavActive(pathname, adminDashboardItem.href, true)) {
    return adminDashboardItem
  }

  if (isAdminNavActive(pathname, guruProfileItem.href, true)) {
    return guruProfileItem
  }

  for (const group of adminNavTree) {
    const match = group.children.find((item) => isAdminNavActive(pathname, item.href, item.exact))
    if (match) return match
  }

  return null
}

export function getAdminGroupDefaultHref(label: string): string | null {
  return adminNavTree.find((g) => g.label === label)?.defaultHref ?? null
}

export const allAdminNavItems: AdminNavItem[] = [
  adminDashboardItem,
  ...adminNavTree.flatMap((g) => g.children),
]
