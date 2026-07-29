import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PmbChartShell } from '@/components/admin/pmb/PmbChartShell'
import type { PmbRegistrationStats } from '@/types'

interface PmbTrendChartProps {
  byMonth: PmbRegistrationStats['by_month']
  isLoading?: boolean
}

export function PmbTrendChart({ byMonth, isLoading }: PmbTrendChartProps) {
  const { t } = useTranslation('admin')

  const data = useMemo(
    () =>
      byMonth.map((row) => ({
        ...row,
        label: `${String(row.month).padStart(2, '0')}/${String(row.year).slice(2)}`,
      })),
    [byMonth],
  )

  return (
    <PmbChartShell
      title={t('pages.pmb.charts.trend')}
      description={t('pages.pmb.charts.trendDesc')}
      emptyLabel={t('pages.pmb.charts.empty')}
      isEmpty={data.length === 0}
      isLoading={isLoading}
      data-testid="pmb-trend-chart"
      className="lg:col-span-2 xl:col-span-1"
    >
      <div className="h-52 sm:h-56" role="img" aria-label={t('pages.pmb.charts.trend')}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="pmbTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="color-mix(in oklch, var(--border) 80%, transparent)" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => [value, t('pages.pmb.charts.count')]}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--primary)"
              strokeWidth={2.25}
              fill="url(#pmbTrendFill)"
              dot={{ r: 3, strokeWidth: 0, fill: 'var(--primary)' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </PmbChartShell>
  )
}
