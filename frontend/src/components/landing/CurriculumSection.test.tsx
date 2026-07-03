import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { CurriculumSection } from '@/components/landing/CurriculumSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useCurriculumsListMock = vi.fn()

vi.mock('@/hooks/useCurriculums', () => ({
  useCurriculumsList: () => useCurriculumsListMock(),
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('CurriculumSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no curriculums', () => {
    useCurriculumsListMock.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<CurriculumSection />)

    expect(screen.getByText('Belum ada data kurikulum.')).toBeInTheDocument()
  })
})
