import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminPageHeaderProps {
  title: string
  description?: string
  badge?: string
  totalCount?: number
  totalLabel?: string
  createHref?: string
  createLabel?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  badge,
  totalCount,
  totalLabel = 'item',
  createHref,
  createLabel = 'Tambah Baru',
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn('admin-page-header admin-card admin-fade-in', className)}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
            {badge && (
              <Badge variant="outline" className="border-gold/40 text-gold">
                {badge}
              </Badge>
            )}
            {totalCount != null && (
              <Badge variant="secondary" className="tabular-nums">
                {totalCount} {totalLabel}
              </Badge>
            )}
          </div>
          {description && <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {actions}
          {createHref && (
            <Button asChild className="min-h-11 w-full sm:w-auto">
              <Link to={createHref}>
                <Plus className="h-4 w-4" aria-hidden />
                {createLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface AdminMiniStatProps {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: 'default' | 'success' | 'gold'
}

export function AdminMiniStat({ label, value, icon: Icon, tone = 'default' }: AdminMiniStatProps) {
  return (
    <div className="admin-card flex items-center gap-3 p-4">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          tone === 'gold' && 'bg-gold/15 text-gold',
          tone === 'success' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
          tone === 'default' && 'bg-primary/10 text-primary',
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  )
}
