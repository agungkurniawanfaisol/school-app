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
  labelKey: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

export type AdminNavGroup = {
  labelKey: string
  icon: LucideIcon
  defaultHref: string
  children: AdminNavItem[]
}

export type AdminBreadcrumb = {
  labelKey: string
  href?: string
}

export const adminDashboardItem: AdminNavItem = {
  labelKey: 'nav.dashboard',
  href: '/admin',
  icon: LayoutDashboard,
  exact: true,
}

export const guruProfileItem: AdminNavItem = {
  labelKey: 'nav.profile',
  href: '/admin/profile',
  icon: UserCog,
  exact: true,
}

export const adminNavTree: AdminNavGroup[] = [
  {
    labelKey: 'nav.group.content',
    icon: FolderOpen,
    defaultHref: '/admin/news',
    children: [
      { labelKey: 'nav.news', href: '/admin/news', icon: Newspaper },
      { labelKey: 'nav.announcements', href: '/admin/announcements', icon: Megaphone },
      { labelKey: 'nav.photoAlbums', href: '/admin/photo-albums', icon: ImageIcon },
      { labelKey: 'nav.heroSliders', href: '/admin/hero-sliders', icon: Image },
      { labelKey: 'nav.virtualTours', href: '/admin/virtual-tours', icon: Compass },
      { labelKey: 'nav.testimonials', href: '/admin/testimonials', icon: Star },
    ],
  },
  {
    labelKey: 'nav.group.academic',
    icon: BookOpen,
    defaultHref: '/admin/program-unggulan',
    children: [
      { labelKey: 'nav.featuredPrograms', href: '/admin/program-unggulan', icon: GraduationCap },
      { labelKey: 'nav.studentActivities', href: '/admin/student-activities', icon: Sparkles },
      { labelKey: 'nav.extracurriculars', href: '/admin/extracurriculars', icon: Users },
      { labelKey: 'nav.achievements', href: '/admin/achievements', icon: Award },
      { labelKey: 'nav.events', href: '/admin/events', icon: Calendar },
    ],
  },
  {
    labelKey: 'nav.group.profile',
    icon: UserRound,
    defaultHref: '/admin/teachers',
    children: [
      { labelKey: 'nav.teachers', href: '/admin/teachers', icon: Users },
      { labelKey: 'nav.facilities', href: '/admin/facilities', icon: Building2 },
      { labelKey: 'nav.documents', href: '/admin/documents', icon: FileDown },
    ],
  },
  {
    labelKey: 'nav.group.pmb',
    icon: GraduationCap,
    defaultHref: '/admin/pmb-registrations',
    children: [
      { labelKey: 'nav.pmbRegistrations', href: '/admin/pmb-registrations', icon: GraduationCap },
      { labelKey: 'nav.faqs', href: '/admin/faqs', icon: HelpCircle },
    ],
  },
  {
    labelKey: 'nav.group.system',
    icon: Settings,
    defaultHref: '/admin/settings',
    children: [
      { labelKey: 'nav.schools', href: '/admin/schools', icon: School },
      { labelKey: 'nav.visionMission', href: '/admin/vision-mission', icon: Target },
      { labelKey: 'nav.media', href: '/admin/media', icon: FileImage },
      { labelKey: 'nav.contactMessages', href: '/admin/contact-messages', icon: Mail },
      { labelKey: 'nav.users', href: '/admin/users', icon: UserCog },
      { labelKey: 'nav.settings', href: '/admin/settings', icon: Settings },
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
      return group.labelKey
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

export function getAdminBreadcrumbs(pathname: string): AdminBreadcrumb[] {
  const crumbs: AdminBreadcrumb[] = [{ labelKey: 'nav.admin', href: '/admin' }]

  if (pathname === '/admin') {
    crumbs.push({ labelKey: 'nav.dashboard' })
    return crumbs
  }

  if (pathname === '/admin/profile') {
    crumbs.push({ labelKey: 'nav.profile' })
    return crumbs
  }

  if (pathname.startsWith('/admin/users')) {
    crumbs.push({ labelKey: 'nav.group.system' })
    if (pathname === '/admin/users/create') {
      crumbs.push({ labelKey: 'nav.breadcrumb.users.add' })
    } else if (pathname.includes('/edit')) {
      crumbs.push({ labelKey: 'nav.breadcrumb.users.edit' })
    } else {
      crumbs.push({ labelKey: 'nav.users' })
    }
    return crumbs
  }

  if (pathname.startsWith('/admin/virtual-tours')) {
    crumbs.push({ labelKey: 'nav.group.content' }, { labelKey: 'nav.virtualTours', href: '/admin/virtual-tours' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/hero-sliders')) {
    crumbs.push({ labelKey: 'nav.group.content' }, { labelKey: 'nav.heroSliders' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/testimonials')) {
    crumbs.push({ labelKey: 'nav.group.content' }, { labelKey: 'nav.testimonials' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/announcements')) {
    crumbs.push({ labelKey: 'nav.group.content' }, { labelKey: 'nav.announcements', href: '/admin/announcements' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/photo-albums')) {
    crumbs.push({ labelKey: 'nav.group.content' }, { labelKey: 'nav.photoAlbums', href: '/admin/photo-albums' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/program-unggulan') || pathname.startsWith('/admin/curriculums')) {
    crumbs.push({ labelKey: 'nav.group.academic' }, { labelKey: 'nav.featuredPrograms', href: '/admin/program-unggulan' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/student-activities')) {
    crumbs.push({ labelKey: 'nav.group.academic' }, { labelKey: 'nav.studentActivities', href: '/admin/student-activities' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/extracurriculars')) {
    crumbs.push({ labelKey: 'nav.group.academic' }, { labelKey: 'nav.extracurriculars', href: '/admin/extracurriculars' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/achievements')) {
    crumbs.push({ labelKey: 'nav.group.academic' }, { labelKey: 'nav.achievements', href: '/admin/achievements' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/events')) {
    crumbs.push({ labelKey: 'nav.group.academic' }, { labelKey: 'nav.events', href: '/admin/events' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/teachers')) {
    crumbs.push({ labelKey: 'nav.group.profile' }, { labelKey: 'nav.teachers', href: '/admin/teachers' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    else if (pathname.includes('/preview')) crumbs.push({ labelKey: 'nav.breadcrumb.preview' })
    else if (pathname.match(/\/teachers\/[^/]+$/)) crumbs.push({ labelKey: 'nav.breadcrumb.detail' })
    return crumbs
  }

  if (pathname.startsWith('/admin/documents')) {
    crumbs.push({ labelKey: 'nav.group.profile' }, { labelKey: 'nav.documents', href: '/admin/documents' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/faqs')) {
    crumbs.push({ labelKey: 'nav.group.pmb' }, { labelKey: 'nav.faqs', href: '/admin/faqs' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname.startsWith('/admin/pmb-registrations')) {
    crumbs.push({ labelKey: 'nav.group.pmb' }, { labelKey: 'nav.pmbRegistrations' })
    if (pathname !== '/admin/pmb-registrations') crumbs.push({ labelKey: 'nav.breadcrumb.detail' })
    return crumbs
  }

  if (pathname.startsWith('/admin/schools')) {
    crumbs.push({ labelKey: 'nav.group.system' }, { labelKey: 'nav.schools' })
    if (pathname.endsWith('/create')) crumbs.push({ labelKey: 'nav.breadcrumb.add' })
    else if (pathname.includes('/edit')) crumbs.push({ labelKey: 'nav.breadcrumb.edit' })
    return crumbs
  }

  if (pathname === '/admin/vision-mission') {
    crumbs.push({ labelKey: 'nav.group.system' }, { labelKey: 'nav.visionMission' })
    return crumbs
  }

  if (pathname === '/admin/media') {
    crumbs.push({ labelKey: 'nav.group.system' }, { labelKey: 'nav.media' })
    return crumbs
  }

  if (pathname.startsWith('/admin/contact-messages')) {
    crumbs.push({ labelKey: 'nav.group.system' }, { labelKey: 'nav.contactMessages', href: '/admin/contact-messages' })
    if (pathname !== '/admin/contact-messages') crumbs.push({ labelKey: 'nav.breadcrumb.detail' })
    return crumbs
  }

  if (pathname === '/admin/settings') {
    crumbs.push({ labelKey: 'nav.group.system' }, { labelKey: 'nav.settings' })
    return crumbs
  }

  for (const group of adminNavTree) {
    const match = group.children.find((item) => isAdminNavActive(pathname, item.href, item.exact))
    if (match) {
      crumbs.push({ labelKey: group.labelKey })
      crumbs.push({ labelKey: match.labelKey })
      return crumbs
    }
  }

  crumbs.push({ labelKey: 'nav.breadcrumb.page' })
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

export function getAdminGroupDefaultHref(labelKey: string): string | null {
  return adminNavTree.find((g) => g.labelKey === labelKey)?.defaultHref ?? null
}

export const allAdminNavItems: AdminNavItem[] = [
  adminDashboardItem,
  ...adminNavTree.flatMap((g) => g.children),
]
