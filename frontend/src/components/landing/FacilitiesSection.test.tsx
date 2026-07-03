import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { FacilitiesSection } from '@/components/landing/FacilitiesSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useFacilitiesListMock = vi.fn()

vi.mock('@/hooks/useFacilities', () => ({
  useFacilitiesList: () => useFacilitiesListMock(),
}))

describe('FacilitiesSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no facilities', () => {
    useFacilitiesListMock.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FacilitiesSection />)

    expect(screen.getByText('Belum ada data fasilitas.')).toBeInTheDocument()
  })
})
