import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { FacilitiesSection } from '@/components/landing/FacilitiesSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useFacilitiesListMock = vi.fn()

vi.mock('@/hooks/useFacilities', () => ({
  useFacilitiesList: () => useFacilitiesListMock(),
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

const sampleFacility = {
  id: 1,
  uuid: 'abc-123',
  school_id: 1,
  name: 'Laboratorium Komputer',
  slug: 'lab-komputer',
  description: 'Lab modern',
  thumbnail: null,
  category: 'akademik',
  order: 1,
  is_active: true,
  is_featured: true,
  created_at: null,
  photos: [],
}

describe('FacilitiesSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no facilities', () => {
    useFacilitiesListMock.mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FacilitiesSection />)

    expect(screen.getByText('Belum ada data fasilitas.')).toBeInTheDocument()
  })

  it('shows Lihat Selengkapnya when total exceeds landing limit', () => {
    useFacilitiesListMock.mockReturnValue({
      data: {
        data: [sampleFacility],
        meta: { total: 10 },
      },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FacilitiesSection />)

    expect(screen.getByRole('link', { name: /Lihat Selengkapnya/i })).toHaveAttribute('href', '/fasilitas')
  })
})
