import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ActivitiesCatalogPage } from '@/pages/activities/ActivitiesCatalogPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useActivitiesListMock = vi.fn()

vi.mock('@/hooks/useActivities', () => ({
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
  uuid: 'activity-uuid-1',
  school_id: 1,
  title: 'Lomba Debat',
  slug: 'lomba-debat',
  excerpt: 'Kompetisi debat antar kelas',
  thumbnail: '/img.jpg',
  category: 'akademik',
  activity_date: '2026-02-01T00:00:00Z',
  order: 0,
  is_active: true,
  is_featured: false,
}

describe('ActivitiesCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useActivitiesListMock.mockReturnValue({
      data: {
        data: [activity],
        meta: { current_page: 1, last_page: 1, per_page: 12, total: 1 },
      },
      isLoading: false,
      isFetching: false,
    })
  })

  it('renders activity cards with detail links', () => {
    renderWithProviders(<ActivitiesCatalogPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Kegiatan Siswa' })).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Lomba Debat/i })
    expect(link).toHaveAttribute('href', '/kegiatan/detail/activity-uuid-1')
  })

  it('passes search to useActivitiesList', () => {
    renderWithProviders(<ActivitiesCatalogPage />)

    fireEvent.change(screen.getByLabelText('Cari kegiatan'), { target: { value: 'debat' } })

    expect(useActivitiesListMock).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'debat', page: 1, per_page: 12 }),
    )
  })
})
