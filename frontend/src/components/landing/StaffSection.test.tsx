import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { StaffSection } from '@/components/landing/StaffSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useTeachersListMock = vi.fn()

vi.mock('@/hooks/useTeachers', () => ({
  useTeachersList: (...args: unknown[]) => useTeachersListMock(...args),
}))

const mockStaff = (id: number) => ({
  id,
  uuid: `uuid-staff-${id}`,
  school_id: 1,
  type: 'staff' as const,
  name: `Staff ${id}`,
  slug: `staff-${id}`,
  title: `Staf Bagian ${id}`,
  subject: null,
  photo: null,
  order: id,
  is_active: true,
  is_featured: false,
  social_media: null,
})

describe('StaffSection', () => {
  beforeEach(() => {
    useTeachersListMock.mockReset()
  })

  it('renders nothing when no staff found', () => {
    useTeachersListMock.mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    })

    const { container } = renderWithProviders(<StaffSection />)
    expect(container.innerHTML).toBe('')
  })

  it('renders staff cards with name and title', () => {
    useTeachersListMock.mockReturnValue({
      data: {
        data: [mockStaff(1), mockStaff(2), mockStaff(3)],
        meta: { total: 3 },
      },
      isLoading: false,
    })

    renderWithProviders(<StaffSection />)

    expect(screen.getByText('Staff 1')).toBeInTheDocument()
    expect(screen.getByText('Staff 2')).toBeInTheDocument()
    expect(screen.getByText('Staff 3')).toBeInTheDocument()
    expect(screen.getByText('Staf Bagian 1')).toBeInTheDocument()
  })

  it('passes type filter to useTeachersList', () => {
    useTeachersListMock.mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
    })

    renderWithProviders(<StaffSection />)

    expect(useTeachersListMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'staff', per_page: 12 }),
    )
  })
})
