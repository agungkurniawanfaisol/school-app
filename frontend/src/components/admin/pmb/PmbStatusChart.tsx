import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTranslation } from 'react-i18next'
import { PmbChartShell } from '@/components/admin/pmb/PmbChartShell'
import type { PmbRegistrationStats } from '@/types'

/** Brand-aligned status colors — always paired with text legend (not color alone). */
export const PMB_STATUS_COLORS: Record<string, string> = {
  draft: '#94a3b8',
  awaiting_verification: '#c9a227',
  needs_revision: '#b45309',
  accepted: '#15803d',
  rejected: '#dc2626',
}

interface PmbStatusChartProps {
  byStatus: PmbRegistrationStats['totals']['by_status']
  isLoading?: boolean
}

export function PmbStatusChart({ byStatus, isLoading }: PmbStatusChartProps) {
  const { t } = useTranslation('admin')

  const data = Object.entries(byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: t(`pages.pmb.statusLabel.${status}`, { defaultValue: status }),
      value: count,
      status,
    }))
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((sum, row) => sum + row.value, 0)

  return (
    <PmbChartShell
      title={t('pages.pmb.charts.status')}
      description={t('pages.pmb.charts.statusDesc')}
      emptyLabel={t('pages.pmb.charts.empty')}
      isEmpty={data.length === 0}
      isLoading={isLoading}
      data-testid="pmb-status-chart"
      contentClassName="space-y-3"
      footer={
        data.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label={t('pages.pmb.charts.status')}>
            {data.map((entry) => (
              <li key={entry.status} className="flex items-center gap-2 text-xs sm:text-sm">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: PMB_STATUS_COLORS[entry.status] ?? 'var(--primary)' }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{entry.name}</span>
                <span className="tabular-nums font-semibold text-foreground">{entry.value}</span>
              </li>
            ))}
          </ul>
        ) : null
      }
    >
      <div className="relative h-48 sm:h-52" role="img" aria-label={t('pages.pmb.charts.statusSummary', { total })}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="52%"
              outerRadius="78%"
              paddingAngle={2}
              stroke="transparent"
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={PMB_STATUS_COLORS[entry.status] ?? 'var(--primary)'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
                name,
              ]}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid color-mix(in oklch, var(--primary) 15%, transparent)',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold tabular-nums tracking-tight">{total}</p>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{t('pages.pmb.charts.count')}</p>
        </div>
      </div>
    </PmbChartShell>
  )
}
