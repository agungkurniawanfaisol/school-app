import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { PmbChartShell } from '@/components/admin/pmb/PmbChartShell'
import type { PmbRegistrationStats } from '@/types'

interface PmbSchoolsChartProps {
  schools: PmbRegistrationStats['top_previous_schools']
  isLoading?: boolean
}

export function PmbSchoolsChart({ schools, isLoading }: PmbSchoolsChartProps) {
  const { t } = useTranslation('admin')
  const data = schools.slice(0, 6).map((row) => ({
    ...row,
    shortName: row.name.length > 18 ? `${row.name.slice(0, 16)}…` : row.name,
  }))

  return (
    <PmbChartShell
      title={t('pages.pmb.charts.schools')}
      description={t('pages.pmb.charts.schoolsDesc')}
      emptyLabel={t('pages.pmb.charts.empty')}
      isEmpty={data.length === 0}
      isLoading={isLoading}
      data-testid="pmb-schools-chart"
      className="md:col-span-2 xl:col-span-1"
    >
      <div className="h-52 sm:h-56" role="img" aria-label={t('pages.pmb.charts.schools')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="color-mix(in oklch, var(--border) 80%, transparent)" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="shortName"
              width={88}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [value, t('pages.pmb.charts.count')]}
              labelFormatter={(_, payload) => {
                const row = payload?.[0]?.payload as { name?: string } | undefined
                return row?.name ?? ''
              }}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="count" fill="var(--gold-accent)" radius={[0, 6, 6, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PmbChartShell>
  )
}
