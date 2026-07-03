import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { LANDING_TEACHER_LIMIT, TeachersSection } from '@/components/landing/TeachersSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useTeachersListMock = vi.fn()

vi.mock('@/hooks/useTeachers', () => ({
  useTeachersList: () => useTeachersListMock(),
}))

const mockTeacher = (id: number, featured = false) => ({
  id,
  uuid: `uuid-${id}`,
  school_id: 1,
  name: `Guru ${id}`,
  slug: `guru-${id}`,
  title: 'Guru',
  subject: 'Matematika',
  photo: null,
  order: id,
  is_active: true,
  is_featured: featured,
  social_media: null,
})

describe('TeachersSection', () => {
  beforeEach(() => {
    useTeachersListMock.mockReset()
    useTeachersListMock.mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
      isFetching: false,
    })
  })

  it('shows empty state when no teachers', () => {
    useTeachersListMock.mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<TeachersSection />)

    expect(screen.getByText('Belum ada data guru.')).toBeInTheDocument()
  })

  it('shows Lihat Selengkapnya when total exceeds landing limit', () => {
    useTeachersListMock.mockReturnValue({
      data: {
        data: Array.from({ length: LANDING_TEACHER_LIMIT }, (_, i) => mockTeacher(i + 1, i === 0)),
        meta: { total: 24 },
      },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<TeachersSection />)

    expect(screen.getByRole('link', { name: /Lihat Selengkapnya/i })).toHaveAttribute('href', '/guru')
    expect(screen.getByText('Guru 1')).toBeInTheDocument()
  })
})
