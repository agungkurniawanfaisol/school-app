import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { FacilitiesSection } from '@/components/landing/FacilitiesSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useFacilitiesListMock = vi.fn()

vi.mock('@/hooks/useFacilities', () => ({
  useFacilitiesList: (...args: unknown[]) => useFacilitiesListMock(...args),
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

function facility(id: number, name: string) {
  return {
    id,
    uuid: `uuid-${id}`,
    school_id: 1,
    name,
    slug: `fasilitas-${id}`,
    description: 'Deskripsi',
    thumbnail: null,
    category: 'akademik',
    order: id,
    is_active: true,
    is_featured: false,
    created_at: null,
    photos: [],
  }
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

  it('renders gallery grid with multiple facilities without featured-only filter', () => {
    useFacilitiesListMock.mockReturnValue({
      data: {
        data: [facility(1, 'Lab Komputer'), facility(2, 'Perpustakaan'), facility(3, 'Aula')],
        meta: { total: 3 },
      },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FacilitiesSection />)

    expect(useFacilitiesListMock).toHaveBeenCalledWith({ per_page: 8 })
    expect(screen.getByTestId('facilities-gallery')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Lab Komputer' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Perpustakaan' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Aula' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Lihat Selengkapnya/i })).toHaveAttribute('href', '/fasilitas')
    expect(screen.queryByRole('button', { name: /Muat lebih banyak/i })).not.toBeInTheDocument()
  })

  it('loads more facilities when Muat lebih banyak is clicked', () => {
    useFacilitiesListMock.mockReturnValue({
      data: {
        data: [facility(1, 'Lab'), facility(2, 'Perpus')],
        meta: { total: 12 },
      },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FacilitiesSection />)

    expect(screen.getByRole('link', { name: /Lihat Fasilitas Lengkap/i })).toHaveAttribute('href', '/fasilitas')
    fireEvent.click(screen.getByRole('button', { name: /Muat lebih banyak/i }))
    expect(useFacilitiesListMock).toHaveBeenLastCalledWith({ per_page: 16 })
  })
})
