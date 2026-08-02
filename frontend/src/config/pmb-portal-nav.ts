import type { LucideIcon } from 'lucide-react'
import { ClipboardList, FileCheck, Info, LogOut, Route, Star } from 'lucide-react'
import type { PmbRegistration, PmbStatus } from '@/types'

/** Portal timeline + admin pipeline (simplified). */
export const PMB_PIPELINE_STATUSES = [
  'draft',
  'awaiting_verification',
  'needs_revision',
  'accepted',
] as const

export type PmbPipelineStatus = (typeof PMB_PIPELINE_STATUSES)[number]

export const PMB_STATUS_LABELS: Record<string, string> = {
  draft: 'Draf',
  awaiting_verification: 'Menunggu verifikasi',
  needs_revision: 'Perlu perbaikan',
  accepted: 'Diterima',
  rejected: 'Ditolak',
  // Legacy labels (pre-migration) — keep for old cached payloads
  awaiting_payment_review: 'Menunggu verifikasi',
  submitted: 'Menunggu verifikasi',
  review: 'Perlu perbaikan',
  pending: 'Menunggu verifikasi',
  paid: 'Menunggu verifikasi',
}

export const PMB_STATUS_DESCRIPTIONS: Record<string, string> = {
  draft: 'Pendaftar masih mengisi formulir dan belum mengirim.',
  awaiting_verification:
    'Pendaftaran sudah dikirim. Admin memeriksa data dan bukti pembayaran. Pendaftar tidak dapat mengubah data.',
  needs_revision:
    'Admin meminta perbaikan. Pendaftar dapat mengedit data/bukti, lalu mengirim ulang.',
  accepted: 'Pendaftaran diterima. Surat penerimaan (LoA) dapat diterbitkan.',
  rejected: 'Pendaftaran ditolak.',
}

export interface PmbPortalNavItem {
  id: string
  label: string
  /** Shorter label for bottom nav (mobile). Falls back to `label`. */
  shortLabel?: string
  href: string
  icon: LucideIcon
  external?: boolean
  action?: 'logout'
}

interface BuildPmbPortalNavOptions {
  isAuthenticated: boolean
  registration?: PmbRegistration | null
}

export const PMB_SUBMITTED_STATUSES: PmbStatus[] = [
  'awaiting_verification',
  'needs_revision',
  'accepted',
  'rejected',
]

export function isPmbRegistrationSubmitted(status: PmbStatus | undefined): boolean {
  return !!status && PMB_SUBMITTED_STATUSES.includes(status)
}

/** Pendaftar may edit only while admin set status to needs_revision. */
export function isPmbRegistrationCorrectionAllowed(status: PmbStatus | undefined): boolean {
  return status === 'needs_revision'
}

export function isPmbRegistrationReadonly(status: PmbStatus | undefined): boolean {
  return isPmbRegistrationSubmitted(status) && !isPmbRegistrationCorrectionAllowed(status)
}

export function buildPmbPortalNav({ isAuthenticated, registration }: BuildPmbPortalNavOptions): PmbPortalNavItem[] {
  const items: PmbPortalNavItem[] = []

  items.push({
    id: 'register',
    label: isAuthenticated
      ? registration?.status === 'draft'
        ? 'Lanjutkan pendaftaran'
        : registration?.status === 'needs_revision'
          ? 'Perbaiki data'
          : 'Data pendaftaran'
      : 'Masuk & Daftar',
    shortLabel: isAuthenticated
      ? registration?.status === 'draft'
        ? 'Lanjut'
        : registration?.status === 'needs_revision'
          ? 'Perbaiki'
          : 'Data'
      : 'Masuk',
    href: '/pmb/daftar',
    icon: ClipboardList,
  })

  if (isAuthenticated && registration?.uuid && isPmbRegistrationSubmitted(registration.status)) {
    items.push({
      id: 'status',
      label: 'Status & Timeline',
      shortLabel: 'Status',
      href: `/pmb/portal/pendaftaran/${registration.uuid}`,
      icon: Route,
    })

    if (registration.status === 'accepted') {
      items.push({
        id: 'loa',
        label: 'Surat Penerimaan',
        shortLabel: 'LoA',
        href: `/pmb/portal/pendaftaran/${registration.uuid}#loa`,
        icon: FileCheck,
      })
    }
  }

  if (isAuthenticated) {
    items.push({
      id: 'testimonial',
      label: 'Testimoni',
      shortLabel: 'Testimoni',
      href: '/pmb/portal/testimoni',
      icon: Star,
    })
  }

  items.push({
    id: 'info',
    label: 'Info PMB',
    shortLabel: 'Info',
    href: '/pmb',
    icon: Info,
  })

  if (isAuthenticated) {
    items.push({
      id: 'logout',
      label: 'Keluar',
      href: '#logout',
      icon: LogOut,
      action: 'logout',
    })
  }

  return items
}

export function isPmbPortalNavActive(pathname: string, href: string, hash = ''): boolean {
  if (href === '#logout' || href === '#') return false

  const [baseHref, hrefHash] = href.split('#')
  const currentHash = hash.replace(/^#/, '')

  if (baseHref === '/pmb') {
    return pathname === '/pmb'
  }

  if (baseHref === '/pmb/daftar') {
    return pathname === '/pmb/daftar'
  }

  if (baseHref === '/pmb/portal/testimoni') {
    return pathname === '/pmb/portal/testimoni'
  }

  if (pathname !== baseHref) {
    return false
  }

  if (hrefHash) {
    return currentHash === hrefHash
  }

  return !currentHash
}

export function resolvePipelineIndex(status: PmbStatus): number {
  if (status === 'rejected') return PMB_PIPELINE_STATUSES.length
  const index = PMB_PIPELINE_STATUSES.indexOf(status as PmbPipelineStatus)
  return index >= 0 ? index : 0
}
