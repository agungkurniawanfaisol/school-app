import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PmbStatsKpis } from '@/components/admin/pmb/PmbStatsKpis'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { PmbRegistrationStats } from '@/types'

const emptyStats: PmbRegistrationStats = {
  totals: {
    all: 0,
    by_status: {
      draft: 0,
      awaiting_verification: 0,
      needs_revision: 0,
      accepted: 0,
      rejected: 0,
    },
  },
  by_grade: [],
  by_gender: [],
  by_month: [],
  top_previous_schools: [],
}

describe('PmbStatsKpis', () => {
  it('renders KPI values from stats', () => {
    const stats: PmbRegistrationStats = {
      ...emptyStats,
      totals: {
        all: 12,
        by_status: {
          ...emptyStats.totals.by_status,
          awaiting_verification: 4,
          needs_revision: 3,
          accepted: 5,
          rejected: 0,
        },
      },
    }

    renderWithProviders(<PmbStatsKpis stats={stats} isLoading={false} />)

    expect(screen.getByTestId('pmb-stats-kpis')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
