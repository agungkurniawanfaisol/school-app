import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { TeachersCatalogPage } from '@/pages/teachers/TeachersCatalogPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useTeachersListMock = vi.fn()

vi.mock('@/hooks/useTeachers', () => ({
  useTeachersList: () => useTeachersListMock(),
}))

describe('TeachersCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders teacher grid with links to slug detail', () => {
    useTeachersListMock.mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            uuid: 'uuid-1',
            school_id: 1,
            name: 'Ustadz Ahmad Fauzi',
            slug: 'ustadz-ahmad-fauzi',
            title: 'Koordinator Tahfidz',
            subject: 'Tahfidz',
            photo: null,
            order: 1,
            is_active: true,
            is_featured: true,
            social_media: null,
          },
        ],
        meta: { total: 1 },
      },
      isLoading: false,
    })

    renderWithProviders(<TeachersCatalogPage />)

    expect(screen.getByRole('heading', { name: 'Guru & Tenaga Pendidik' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ustadz Ahmad Fauzi/i })).toHaveAttribute(
      'href',
      '/guru/ustadz-ahmad-fauzi',
    )
  })
})
