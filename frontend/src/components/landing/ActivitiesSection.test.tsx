import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ActivitiesSection } from '@/components/landing/ActivitiesSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useActivitiesListMock = vi.fn()

vi.mock('@/hooks/useActivities', () => ({
  useActivitiesList: () => useActivitiesListMock(),
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('ActivitiesSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no activities', () => {
    useActivitiesListMock.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<ActivitiesSection />)

    expect(screen.getByText('Belum ada data kegiatan.')).toBeInTheDocument()
  })
})
