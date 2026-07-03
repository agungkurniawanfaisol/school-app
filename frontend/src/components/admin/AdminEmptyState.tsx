import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminEmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  children?: ReactNode
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  onAction,
  className,
  children,
}: AdminEmptyStateProps) {
  return (
    <div className={cn('admin-empty-state', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {children}
      {(actionHref || onAction) && actionLabel && (
        <div className="mt-4">
          {actionHref ? (
            <Button asChild>
              <Link to={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button type="button" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
