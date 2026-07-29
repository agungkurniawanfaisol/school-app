import type { LucideIcon } from 'lucide-react'
import { ClipboardList, Clock3, SearchCheck, UserCheck, UserX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { PmbRegistrationStats } from '@/types'

interface PmbStatsKpisProps {
  stats: PmbRegistrationStats | undefined
  isLoading: boolean
}

type KpiTone = 'primary' | 'gold' | 'info' | 'success' | 'danger'

interface KpiItem {
  key: string
  label: string
  value: number
  icon: LucideIcon
  tone: KpiTone
  hint?: string
}

const toneStyles: Record<KpiTone, { bar: string; icon: string; value: string }> = {
  primary: {
    bar: 'bg-primary',
    icon: 'bg-primary/10 text-primary',
    value: 'text-foreground',
  },
  gold: {
    bar: 'bg-gold',
    icon: 'bg-gold/15 text-gold',
    value: 'text-foreground',
  },
  info: {
    bar: 'bg-sky-600 dark:bg-sky-400',
    icon: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    value: 'text-foreground',
  },
  success: {
    bar: 'bg-emerald-600 dark:bg-emerald-400',
    icon: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    value: 'text-foreground',
  },
  danger: {
    bar: 'bg-destructive',
    icon: 'bg-destructive/10 text-destructive',
    value: 'text-foreground',
  },
}

function pct(part: number, total: number): string | undefined {
  if (total <= 0) return undefined
  return `${Math.round((part / total) * 100)}%`
}

export function PmbStatsKpis({ stats, isLoading }: PmbStatsKpisProps) {
  const { t } = useTranslation('admin')
  const byStatus = stats?.totals.by_status ?? {}
  const total = stats?.totals.all ?? 0
  const reviewCount = byStatus.needs_revision ?? 0
  const awaiting = byStatus.awaiting_verification ?? 0
  const accepted = byStatus.accepted ?? 0
  const rejected = byStatus.rejected ?? 0

  if (isLoading && !stats) {
    return (
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5"
        data-testid="pmb-stats-kpis"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[96px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const items: KpiItem[] = [
    {
      key: 'total',
      label: t('pages.pmb.stats.total'),
      value: total,
      icon: ClipboardList,
      tone: 'primary',
      hint: t('pages.pmb.stats.totalHint'),
    },
    {
      key: 'awaiting',
      label: t('pages.pmb.stats.awaitingVerification', { defaultValue: t('pages.pmb.stats.awaitingPayment') }),
      value: awaiting,
      icon: Clock3,
      tone: 'gold',
      hint: pct(awaiting, total),
    },
    {
      key: 'needs_revision',
      label: t('pages.pmb.stats.needsRevision', { defaultValue: t('pages.pmb.stats.review') }),
      value: reviewCount,
      icon: SearchCheck,
      tone: 'info',
      hint: pct(reviewCount, total),
    },
    {
      key: 'accepted',
      label: t('pages.pmb.stats.accepted'),
      value: accepted,
      icon: UserCheck,
      tone: 'success',
      hint: pct(accepted, total),
    },
    {
      key: 'rejected',
      label: t('pages.pmb.stats.rejected'),
      value: rejected,
      icon: UserX,
      tone: 'danger',
      hint: pct(rejected, total),
    },
  ]

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5 print:grid-cols-5"
      data-testid="pmb-stats-kpis"
      role="list"
      aria-label={t('pages.pmb.stats.aria')}
    >
      {items.map((item) => {
        const styles = toneStyles[item.tone]
        const Icon = item.icon
        return (
          <div
            key={item.key}
            role="listitem"
            className="admin-card relative overflow-hidden p-3.5 sm:p-4"
          >
            <div className={cn('absolute inset-y-0 left-0 w-1', styles.bar)} aria-hidden />
            <div className="flex items-start justify-between gap-2 pl-2">
              <div className="min-w-0 space-y-1">
                <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {item.label}
                </p>
                <p className={cn('text-2xl font-bold tabular-nums tracking-tight sm:text-3xl', styles.value)}>
                  {item.value}
                </p>
                {item.hint ? (
                  <p className="text-[11px] text-muted-foreground sm:text-xs">{item.hint}</p>
                ) : null}
              </div>
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10',
                  styles.icon,
                )}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
