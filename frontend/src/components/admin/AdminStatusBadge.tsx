import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

const STATUS_KEY_MAP: Record<string, string> = {
  published: 'status.published',
  draft: 'status.draft',
  pending: 'status.pending',
  review: 'status.reviewing',
  accepted: 'status.accepted',
  rejected: 'status.rejected',
  paid: 'status.paid',
  active: 'status.active',
  completed: 'status.ended',
  cancelled: 'status.cancelled',
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  published: 'default',
  draft: 'secondary',
  pending: 'secondary',
  review: 'outline',
  accepted: 'default',
  rejected: 'destructive',
  paid: 'default',
  active: 'default',
  completed: 'default',
  cancelled: 'destructive',
}

interface AdminStatusBadgeProps {
  status: string
  className?: string
}

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const { t } = useTranslation('admin')
  const labelKey = STATUS_KEY_MAP[status]
  const label = labelKey ? t(labelKey) : status
  const variant = STATUS_VARIANTS[status] ?? 'outline'

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}

interface AdminActiveBadgeProps {
  isActive: boolean
}

export function AdminActiveBadge({ isActive }: AdminActiveBadgeProps) {
  const { t } = useTranslation('admin')

  return (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? t('status.active') : t('status.inactive')}
    </Badge>
  )
}

interface AdminFeaturedBadgeProps {
  isFeatured: boolean
}

export function AdminFeaturedBadge({ isFeatured }: AdminFeaturedBadgeProps) {
  const { t } = useTranslation('admin')

  if (!isFeatured) return <span className="text-muted-foreground">{t('common.dash')}</span>
  return (
    <Badge variant="outline" className="border-gold/40 text-gold">
      {t('status.featured')}
    </Badge>
  )
}

export function adminStatusLabel(status: string, t: (key: string) => string): string {
  const labelKey = STATUS_KEY_MAP[status]
  return labelKey ? t(labelKey) : status
}

export type AdminStatusBadgePropsType = AdminStatusBadgeProps

export function AdminStatusBadgeGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-1">{children}</div>
}
