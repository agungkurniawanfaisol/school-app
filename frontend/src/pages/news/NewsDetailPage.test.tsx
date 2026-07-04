import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NewsDetailPage } from '@/pages/news/NewsDetailPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useNewsDetailByUuidMock = vi.fn()
const useNewsListMock = vi.fn()

vi.mock('@/hooks/useNews', () => ({
  useNewsDetailByUuid: (uuid: string) => useNewsDetailByUuidMock(uuid),
  useNewsList: (filters: unknown) => useNewsListMock(filters),
}))

vi.mock('@/components/i18n/LanguageProvider', () => ({
  useLanguage: () => ({ locale: 'id', dir: 'ltr', isChangingLocale: false, setLocale: vi.fn() }),
}))

vi.mock('@/components/layout/PublicPageShell', () => ({
  PublicPageShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const news = {
  id: 1,
  uuid: 'test-uuid',
  school_id: 1,
  title: 'Berita Penting',
  slug: 'berita-penting',
  excerpt: 'Ringkasan berita',
  content: '<p>Konten berita panjang untuk estimasi waktu baca.</p>',
  thumbnail: '/img.jpg',
  category: 'umum',
  published_at: '2026-01-01T00:00:00Z',
  author: { id: 1, name: 'Admin' },
  order: 0,
  is_active: true,
  is_featured: true,
}

describe('NewsDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useNewsListMock.mockReturnValue({ data: { data: [] } })
  })

  it('renders enhanced layout elements', () => {
    useNewsDetailByUuidMock.mockReturnValue({ data: news, isLoading: false, isError: false })

    renderWithProviders(<NewsDetailPage />, {
      route: '/berita/detail/test-uuid',
      path: '/berita/detail/:uuid',
    })

    expect(screen.getByRole('heading', { level: 1, name: 'Berita Penting' })).toBeInTheDocument()
    expect(screen.getByText(/menit baca/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Berita/i })).toHaveAttribute('href', '/berita')
    expect(screen.getByText('Konten berita panjang untuk estimasi waktu baca.')).toBeInTheDocument()
  })

  it('shows skeleton while loading', () => {
    useNewsDetailByUuidMock.mockReturnValue({ data: undefined, isLoading: true, isError: false })

    const { container } = renderWithProviders(<NewsDetailPage />, {
      route: '/berita/detail/test-uuid',
      path: '/berita/detail/:uuid',
    })

    expect(container.querySelector('.animate-pulse')).toBeTruthy()
  })
})
