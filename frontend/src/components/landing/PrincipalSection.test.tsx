import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { PrincipalSection } from '@/components/landing/PrincipalSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useTeachersListMock = vi.fn()

vi.mock('@/hooks/useTeachers', () => ({
  useTeachersList: (...args: unknown[]) => useTeachersListMock(...args),
}))

describe('PrincipalSection', () => {
  beforeEach(() => {
    useTeachersListMock.mockReset()
  })

  it('renders nothing when no principal found', () => {
    useTeachersListMock.mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    })

    const { container } = renderWithProviders(<PrincipalSection />)
    expect(container.innerHTML).toBe('')
  })

  it('renders principal name and title', () => {
    useTeachersListMock.mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            uuid: 'uuid-1',
            school_id: 1,
            type: 'kepala_sekolah',
            name: 'H. Muhammad Ridwan, M.Pd.I.',
            slug: 'h-muhammad-ridwan',
            title: 'Kepala Sekolah',
            subject: null,
            bio: 'Memimpin sekolah sejak 2015.',
            photo: null,
            order: 0,
            is_active: true,
            is_featured: true,
            social_media: null,
          },
        ],
        meta: { total: 1 },
      },
      isLoading: false,
    })

    renderWithProviders(<PrincipalSection />)

    expect(screen.getByText('H. Muhammad Ridwan, M.Pd.I.')).toBeInTheDocument()
    expect(screen.getAllByText('Kepala Sekolah').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Memimpin sekolah sejak 2015.')).toBeInTheDocument()
  })

  it('passes type filter to useTeachersList', () => {
    useTeachersListMock.mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    })

    renderWithProviders(<PrincipalSection />)

    expect(useTeachersListMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'kepala_sekolah', per_page: 1 }),
    )
  })
})
