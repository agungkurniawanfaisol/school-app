import { Percent, TrendingUp, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PmbGradeChart } from '@/components/admin/pmb/PmbGradeChart'
import { PmbSchoolsChart } from '@/components/admin/pmb/PmbSchoolsChart'
import { PmbStatsKpis } from '@/components/admin/pmb/PmbStatsKpis'
import { PmbStatusChart } from '@/components/admin/pmb/PmbStatusChart'
import { PmbTrendChart } from '@/components/admin/pmb/PmbTrendChart'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { PmbRegistrationStats } from '@/types'

interface PmbAnalyticsDashboardProps {
  stats: PmbRegistrationStats | undefined
  isLoading: boolean
  academicYearLabel?: string
}

export function PmbAnalyticsDashboard({ stats, isLoading, academicYearLabel }: PmbAnalyticsDashboardProps) {
  const { t } = useTranslation('admin')
  const byStatus = stats?.totals.by_status ?? {}
  const total = stats?.totals.all ?? 0
  const accepted = byStatus.accepted ?? 0
  const rejected = byStatus.rejected ?? 0
  const decided = accepted + rejected
  const acceptanceRate = decided > 0 ? Math.round((accepted / decided) * 100) : null
  const male = stats?.by_gender.find((g) => g.gender === 'L')?.count ?? 0
  const female = stats?.by_gender.find((g) => g.gender === 'P')?.count ?? 0
  const genderTotal = male + female

  return (
    <section className="space-y-4 sm:space-y-5 print:space-y-3" data-testid="pmb-analytics-dashboard" aria-labelledby="pmb-analytics-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="pmb-analytics-heading" className="font-heading text-base font-semibold tracking-tight sm:text-lg">
              {t('pages.pmb.analyticsTitle')}
            </h2>
            {academicYearLabel ? (
              <Badge variant="outline" className="border-primary/25 bg-primary/5 text-primary">
                {academicYearLabel}
              </Badge>
            ) : (
              <Badge variant="secondary">{t('common.allAcademicYears')}</Badge>
            )}
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">{t('pages.pmb.analyticsDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InsightChip
          icon={Users}
          label={t('pages.pmb.insight.applicants')}
          value={String(total)}
          tone="primary"
        />
        <InsightChip
          icon={Percent}
          label={t('pages.pmb.insight.acceptance')}
          value={acceptanceRate == null ? '—' : `${acceptanceRate}%`}
          hint={
            decided > 0
              ? t('pages.pmb.insight.acceptanceHint', { accepted, rejected })
              : t('pages.pmb.insight.acceptanceEmpty')
          }
          tone="success"
        />
        <InsightChip
          icon={TrendingUp}
          label={t('pages.pmb.insight.gender')}
          value={genderTotal > 0 ? `${male} / ${female}` : '—'}
          hint={t('pages.pmb.insight.genderHint')}
          tone="gold"
        />
      </div>

      <PmbStatsKpis stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-2">
        <PmbStatusChart byStatus={byStatus} isLoading={isLoading && !stats} />
        <PmbGradeChart byGrade={stats?.by_grade ?? []} isLoading={isLoading && !stats} />
        <PmbTrendChart byMonth={stats?.by_month ?? []} isLoading={isLoading && !stats} />
        <PmbSchoolsChart schools={stats?.top_previous_schools ?? []} isLoading={isLoading && !stats} />
      </div>
    </section>
  )
}

function InsightChip({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Users
  label: string
  value: string
  hint?: string
  tone: 'primary' | 'success' | 'gold'
}) {
  return (
    <div
      className={cn(
        'admin-card flex items-center gap-3 p-3.5 sm:p-4',
        tone === 'primary' && 'border-primary/15',
        tone === 'success' && 'border-emerald-500/20',
        tone === 'gold' && 'border-gold/25',
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          tone === 'primary' && 'bg-primary/10 text-primary',
          tone === 'success' && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
          tone === 'gold' && 'bg-gold/15 text-gold',
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</p>
        <p className="truncate text-lg font-bold tabular-nums tracking-tight sm:text-xl">{value}</p>
        {hint ? <p className="truncate text-[11px] text-muted-foreground sm:text-xs">{hint}</p> : null}
      </div>
    </div>
  )
}
