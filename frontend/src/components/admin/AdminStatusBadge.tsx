import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  published: { label: 'Dipublikasikan', variant: 'default' },
  draft: { label: 'Draf', variant: 'secondary' },
  pending: { label: 'Menunggu', variant: 'secondary' },
  review: { label: 'Direview', variant: 'outline' },
  accepted: { label: 'Diterima', variant: 'default' },
  rejected: { label: 'Ditolak', variant: 'destructive' },
  paid: { label: 'Lunas', variant: 'default' },
  active: { label: 'Aktif', variant: 'default' },
  completed: { label: 'Selesai', variant: 'default' },
  cancelled: { label: 'Dibatalkan', variant: 'destructive' },
}

interface AdminStatusBadgeProps {
  status: string
  className?: string
}

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, variant: 'outline' as const }
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

interface AdminActiveBadgeProps {
  isActive: boolean
}

export function AdminActiveBadge({ isActive }: AdminActiveBadgeProps) {
  return (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Aktif' : 'Nonaktif'}
    </Badge>
  )
}

interface AdminFeaturedBadgeProps {
  isFeatured: boolean
}

export function AdminFeaturedBadge({ isFeatured }: AdminFeaturedBadgeProps) {
  if (!isFeatured) return <span className="text-muted-foreground">—</span>
  return <Badge variant="outline" className="border-gold/40 text-gold">Unggulan</Badge>
}

export function adminStatusLabel(status: string): string {
  return STATUS_MAP[status]?.label ?? status
}

export type AdminStatusBadgePropsType = AdminStatusBadgeProps

export function AdminStatusBadgeGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-1">{children}</div>
}
