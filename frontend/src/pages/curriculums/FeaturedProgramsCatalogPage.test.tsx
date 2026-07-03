import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { FeaturedProgramsCatalogPage } from '@/pages/curriculums/FeaturedProgramsCatalogPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useCurriculumsListMock = vi.fn()

vi.mock('@/hooks/useCurriculums', () => ({
  useCurriculumsList: () => useCurriculumsListMock(),
}))

vi.mock('@/components/layout/PublicPageShell', () => ({
  PublicPageShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('FeaturedProgramsCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all featured programs', () => {
    useCurriculumsListMock.mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            school_id: 1,
            title: 'Program Tahfidz',
            slug: 'tahfidz',
            excerpt: 'Hafalan Al-Quran',
            icon: 'book-open',
            thumbnail: null,
            category: 'tahfidz',
            order: 1,
            is_active: true,
            is_featured: true,
            created_at: null,
          },
          {
            id: 2,
            school_id: 1,
            title: 'Akademik',
            slug: 'akademik',
            excerpt: 'Kurikulum nasional',
            icon: 'graduation-cap',
            thumbnail: null,
            category: 'akademik',
            order: 2,
            is_active: true,
            is_featured: true,
            created_at: null,
          },
        ],
      },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FeaturedProgramsCatalogPage />)

    expect(screen.getByRole('heading', { name: /Program Pembelajaran Unggulan/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Program Tahfidz/i })).toHaveAttribute('href', '/program/tahfidz')
    expect(screen.getByRole('link', { name: /Akademik/i })).toHaveAttribute('href', '/program/akademik')
  })
})
