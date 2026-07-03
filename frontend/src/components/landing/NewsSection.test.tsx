import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NewsSection } from '@/components/landing/NewsSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useNewsListMock = vi.fn()

vi.mock('@/hooks/useNews', () => ({
  useNewsList: () => useNewsListMock(),
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('NewsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no news', () => {
    useNewsListMock.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<NewsSection />)

    expect(screen.getByText('Belum ada berita.')).toBeInTheDocument()
  })
})
