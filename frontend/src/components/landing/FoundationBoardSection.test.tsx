import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { FoundationBoardSection } from '@/components/landing/FoundationBoardSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useTeachersListMock = vi.fn()

vi.mock('@/hooks/useTeachers', () => ({
  useTeachersList: (filters: unknown) => useTeachersListMock(filters),
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('FoundationBoardSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when no foundation board members', () => {
    useTeachersListMock.mockReturnValue({ data: { data: [] }, isLoading: false })

    const { container } = renderWithProviders(<FoundationBoardSection />)

    expect(container).toBeEmptyDOMElement()
    expect(useTeachersListMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pimpinan_yayasan', per_page: 4 }),
    )
  })

  it('renders member names and titles', () => {
    useTeachersListMock.mockReturnValue({
      data: {
        data: [
          { id: 1, name: 'H. Abdullah Syafii', title: 'Ketua Yayasan', type: 'pimpinan_yayasan' },
          { id: 2, name: 'Hj. Siti Aminah', title: 'Wakil Ketua', type: 'pimpinan_yayasan' },
        ],
      },
      isLoading: false,
    })

    renderWithProviders(<FoundationBoardSection />)

    expect(screen.getByText('Pimpinan Yayasan')).toBeInTheDocument()
    expect(screen.getByText('H. Abdullah Syafii')).toBeInTheDocument()
    expect(screen.getByText('Ketua Yayasan')).toBeInTheDocument()
    expect(screen.getByText('Hj. Siti Aminah')).toBeInTheDocument()
  })

  it('caps display at 4 members', () => {
    useTeachersListMock.mockReturnValue({
      data: {
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `Anggota ${i + 1}`,
          title: `Jabatan ${i + 1}`,
          type: 'pimpinan_yayasan',
        })),
      },
      isLoading: false,
    })

    renderWithProviders(<FoundationBoardSection />)

    expect(screen.getByText('Anggota 4')).toBeInTheDocument()
    expect(screen.queryByText('Anggota 5')).not.toBeInTheDocument()
  })
})
