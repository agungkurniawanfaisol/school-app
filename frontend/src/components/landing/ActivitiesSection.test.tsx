import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ActivitiesSection } from '@/components/landing/ActivitiesSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useActivitiesListMock = vi.fn()

vi.mock('@/hooks/useActivities', () => ({
  useActivitiesList: () => useActivitiesListMock(),
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
