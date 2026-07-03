import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useTestimonialsListMock = vi.fn()

vi.mock('@/hooks/useTestimonials', () => ({
  useTestimonialsList: () => useTestimonialsListMock(),
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('TestimonialsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no testimonials', () => {
    useTestimonialsListMock.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<TestimonialsSection />)

    expect(screen.getByText('Belum ada testimoni.')).toBeInTheDocument()
  })
})
