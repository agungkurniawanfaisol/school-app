import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { FacilitiesCatalogPage } from '@/pages/facilities/FacilitiesCatalogPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useFacilitiesListMock = vi.fn()

vi.mock('@/hooks/useFacilities', () => ({
  useFacilitiesList: () => useFacilitiesListMock(),
}))

vi.mock('@/components/layout/PublicPageShell', () => ({
  PublicPageShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('FacilitiesCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all facilities with links to detail', () => {
    useFacilitiesListMock.mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            uuid: 'a',
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
          },
          {
            id: 2,
            uuid: 'b',
            school_id: 1,
            name: 'Perpustakaan',
            slug: 'perpustakaan',
            description: 'Koleksi lengkap',
            thumbnail: null,
            category: 'akademik',
            order: 2,
            is_active: true,
            is_featured: false,
            created_at: null,
            photos: [],
          },
        ],
      },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FacilitiesCatalogPage />)

    expect(screen.getByRole('heading', { name: /Fasilitas Sekolah/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Laboratorium Komputer/i })).toHaveAttribute(
      'href',
      '/fasilitas/lab-komputer',
    )
    expect(screen.getByRole('link', { name: /Perpustakaan/i })).toHaveAttribute(
      'href',
      '/fasilitas/perpustakaan',
    )
  })
})
