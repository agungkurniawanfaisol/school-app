import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PmbChartShellProps {
  title: string
  description?: string
  isEmpty?: boolean
  emptyLabel: string
  isLoading?: boolean
  className?: string
  contentClassName?: string
  footer?: ReactNode
  children: ReactNode
  'data-testid'?: string
}

export function PmbChartShell({
  title,
  description,
  isEmpty,
  emptyLabel,
  isLoading,
  className,
  contentClassName,
  footer,
  children,
  'data-testid': testId,
}: PmbChartShellProps) {
  return (
    <Card
      className={cn(
        'admin-card group overflow-hidden border-primary/10 transition-shadow duration-200 hover:shadow-md',
        className,
      )}
      data-testid={testId}
    >
      <CardHeader className="space-y-1 border-b border-primary/5 bg-muted/20 px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle className="font-heading text-sm font-semibold tracking-tight sm:text-base">{title}</CardTitle>
        {description ? <CardDescription className="text-xs leading-relaxed">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className={cn('px-3 py-3 sm:px-4 sm:py-4', contentClassName)}>
        {isLoading ? (
          <Skeleton className="h-52 w-full rounded-lg sm:h-56" />
        ) : isEmpty ? (
          <div
            className="flex h-52 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-primary/15 bg-muted/20 px-4 text-center sm:h-56"
            role="status"
          >
            <p className="text-sm font-medium text-foreground/80">{emptyLabel}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer ? <div className="border-t border-primary/5 px-4 py-3 sm:px-5">{footer}</div> : null}
    </Card>
  )
}
