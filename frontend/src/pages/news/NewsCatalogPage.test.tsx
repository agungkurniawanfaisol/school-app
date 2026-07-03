import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NewsCatalogPage } from '@/pages/news/NewsCatalogPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useNewsListMock = vi.fn()

vi.mock('@/hooks/useNews', () => ({
  useNewsList: (filters: unknown) => useNewsListMock(filters),
}))

vi.mock('@/components/layout/PublicPageShell', () => ({
  PublicPageShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const newsItem = {
  id: 1,
  uuid: 'news-uuid-1',
  school_id: 1,
  title: 'Berita Sekolah',
  slug: 'berita-sekolah',
  excerpt: 'Ringkasan berita',
  thumbnail: '/img.jpg',
  category: 'umum',
  published_at: '2026-01-01T00:00:00Z',
  order: 0,
  is_active: true,
  is_featured: false,
}

describe('NewsCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useNewsListMock.mockReturnValue({
      data: {
        data: [newsItem],
        meta: { current_page: 1, last_page: 2, per_page: 12, total: 13 },
      },
      isLoading: false,
      isFetching: false,
    })
  })

  it('renders news cards with detail links', () => {
    renderWithProviders(<NewsCatalogPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Berita & Artikel' })).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Berita Sekolah/i })
    expect(link).toHaveAttribute('href', '/berita/detail/news-uuid-1')
  })

  it('passes search and page to useNewsList', () => {
    renderWithProviders(<NewsCatalogPage />)

    fireEvent.change(screen.getByLabelText('Cari berita'), { target: { value: 'prestasi' } })

    expect(useNewsListMock).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'prestasi', page: 1, per_page: 12 }),
    )
  })
})
