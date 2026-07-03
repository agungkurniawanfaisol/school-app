import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface DashboardStatCardProps {
  label: string
  href: string
  icon: LucideIcon
  count?: number
  isLoading?: boolean
  highlight?: boolean
  hint?: string
  delayMs?: number
}

export function DashboardStatCard({
  label,
  href,
  icon: Icon,
  count,
  isLoading,
  highlight = false,
  hint,
  delayMs = 0,
}: DashboardStatCardProps) {
  return (
    <Link
      to={href}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ animationDelay: `${delayMs}ms` }}
      aria-label={`${label}${count != null ? `: ${count}` : ''}`}
    >
      <Card
        className={cn(
          'admin-card relative overflow-hidden border-primary/10 transition-all duration-200',
          'hover:border-primary/25 hover:shadow-md motion-reduce:transform-none',
          highlight && 'border-gold/30 bg-gradient-to-br from-gold/5 to-transparent',
        )}
      >
        <CardContent className="flex items-start gap-4 p-4 sm:p-5">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              highlight ? 'bg-gold/15 text-gold' : 'bg-primary/10 text-primary',
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-14" />
            ) : (
              <p
                className={cn(
                  'mt-0.5 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl',
                  highlight && 'text-gold',
                )}
              >
                {count ?? '—'}
              </p>
            )}
            {hint && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <ArrowUpRight
            className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
            aria-hidden
          />
        </CardContent>
      </Card>
    </Link>
  )
}
