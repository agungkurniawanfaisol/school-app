import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PmbFormSectionProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function PmbFormSection({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
}: PmbFormSectionProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-primary/15 bg-card shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-3 border-b border-primary/10 bg-primary/5 px-4 py-3 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {action}
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">{children}</div>
    </section>
  )
}
