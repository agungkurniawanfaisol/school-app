import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { CoursesPreviewSection } from '@/components/landing/CoursesPreviewSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useCoursesListMock = vi.fn()

vi.mock('@/hooks/useCourses', () => ({
  useCoursesList: () => useCoursesListMock(),
}))

describe('CoursesPreviewSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no courses', () => {
    useCoursesListMock.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<CoursesPreviewSection />)

    expect(screen.getByText('Belum ada kursus tersedia.')).toBeInTheDocument()
  })
})
