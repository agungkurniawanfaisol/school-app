import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ActivityDetailPage } from '@/pages/activities/ActivityDetailPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useActivityDetailByUuidMock = vi.fn()
const useActivitiesListMock = vi.fn()

vi.mock('@/hooks/useActivities', () => ({
  useActivityDetailByUuid: (uuid: string) => useActivityDetailByUuidMock(uuid),
  useActivitiesList: (filters: unknown) => useActivitiesListMock(filters),
}))

vi.mock('@/components/i18n/LanguageProvider', () => ({
  useLanguage: () => ({ locale: 'id', dir: 'ltr', isChangingLocale: false, setLocale: vi.fn() }),
}))

vi.mock('@/components/layout/PublicPageShell', () => ({
  PublicPageShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const activity = {
  id: 1,
  uuid: 'activity-uuid',
  school_id: 1,
  title: 'Lomba Tahfidz',
  slug: 'lomba-tahfidz',
  excerpt: 'Ringkasan kegiatan',
  content: '<p>Detail kegiatan siswa.</p>',
  thumbnail: '/activity.jpg',
  category: 'akademik',
  activity_date: '2026-02-15T00:00:00Z',
  order: 0,
  is_active: true,
  is_featured: true,
  published_at: '2026-02-01T00:00:00Z',
}

describe('ActivityDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useActivitiesListMock.mockReturnValue({ data: { data: [] } })
  })

  it('renders enhanced layout with title and share', () => {
    useActivityDetailByUuidMock.mockReturnValue({ data: activity, isLoading: false, isError: false })

    renderWithProviders(<ActivityDetailPage />, {
      route: '/kegiatan/detail/activity-uuid',
      path: '/kegiatan/detail/:uuid',
    })

    expect(screen.getByRole('heading', { level: 1, name: 'Lomba Tahfidz' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /bagikan|share/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('link', { name: /Kegiatan/i })).toHaveAttribute('href', '/kegiatan')
    expect(screen.getByText('Detail kegiatan siswa.')).toBeInTheDocument()
    expect(document.title).toContain('Lomba Tahfidz')
  })

  it('renders floating info cards with category and date', () => {
    useActivityDetailByUuidMock.mockReturnValue({ data: activity, isLoading: false, isError: false })

    renderWithProviders(<ActivityDetailPage />, {
      route: '/kegiatan/detail/activity-uuid',
      path: '/kegiatan/detail/:uuid',
    })

    expect(screen.getByText('akademik')).toBeInTheDocument()
    expect(screen.getByText(/15 Februari 2026/)).toBeInTheDocument()
  })

  it('renders not found state', () => {
    useActivityDetailByUuidMock.mockReturnValue({ data: null, isLoading: false, isError: true })

    renderWithProviders(<ActivityDetailPage />, {
      route: '/kegiatan/detail/missing-uuid',
      path: '/kegiatan/detail/:uuid',
    })

    expect(screen.getByText(/tidak ditemukan/i)).toBeInTheDocument()
  })
})
