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
  createHref?: string
  createLabel?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  badge,
  createHref,
  createLabel = 'Tambah Baru',
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn('admin-card admin-fade-in p-4 sm:p-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
            {badge && (
              <Badge variant="outline" className="border-gold/40 text-gold">
                {badge}
              </Badge>
            )}
          </div>
          {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {actions}
          {createHref && (
            <Button asChild className="w-full sm:w-auto">
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
