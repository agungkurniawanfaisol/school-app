import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardFeedCardProps {
  title: string
  viewAllHref: string
  viewAllLabel?: string
  isLoading: boolean
  isEmpty: boolean
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
  emptyActionHref?: string
  emptyActionLabel?: string
  children: ReactNode
}

export function DashboardFeedCard({
  title,
  viewAllHref,
  viewAllLabel = 'Lihat semua',
  isLoading,
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyActionHref,
  emptyActionLabel,
  children,
}: DashboardFeedCardProps) {
  return (
    <Card className="admin-card border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {!isEmpty && !isLoading && (
          <Link
            to={viewAllHref}
            className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {viewAllLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </CardHeader>
      <CardContent className="p-0 pt-0">
        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="px-4 pb-4">
            <AdminEmptyState
              icon={emptyIcon}
              title={emptyTitle}
              description={emptyDescription}
              actionHref={emptyActionHref}
              actionLabel={emptyActionLabel}
              className="border-0 bg-muted/30 py-8"
            />
          </div>
        ) : (
          <div className="divide-y">{children}</div>
        )}
      </CardContent>
    </Card>
  )
}
