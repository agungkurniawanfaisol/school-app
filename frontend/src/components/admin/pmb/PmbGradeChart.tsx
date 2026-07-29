import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { PmbChartShell } from '@/components/admin/pmb/PmbChartShell'
import type { PmbRegistrationStats } from '@/types'

interface PmbGradeChartProps {
  byGrade: PmbRegistrationStats['by_grade']
  isLoading?: boolean
}

export function PmbGradeChart({ byGrade, isLoading }: PmbGradeChartProps) {
  const { t } = useTranslation('admin')

  return (
    <PmbChartShell
      title={t('pages.pmb.charts.grade')}
      description={t('pages.pmb.charts.gradeDesc')}
      emptyLabel={t('pages.pmb.charts.empty')}
      isEmpty={byGrade.length === 0}
      isLoading={isLoading}
      data-testid="pmb-grade-chart"
    >
      <div className="h-52 sm:h-56" role="img" aria-label={t('pages.pmb.charts.grade')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byGrade} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="color-mix(in oklch, var(--border) 80%, transparent)" />
            <XAxis dataKey="grade" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => [value, t('pages.pmb.charts.count')]}
              cursor={{ fill: 'color-mix(in oklch, var(--primary) 8%, transparent)' }}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PmbChartShell>
  )
}
