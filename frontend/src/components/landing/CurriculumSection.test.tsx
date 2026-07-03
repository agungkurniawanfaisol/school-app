import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { FeaturedProgramsSection } from '@/components/landing/FeaturedProgramsSection'
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

const sampleProgram = {
  id: 1,
  school_id: 1,
  title: 'Program Tahfidz',
  slug: 'tahfidz',
  excerpt: 'Hafalan Al-Quran',
  icon: 'book-open',
  thumbnail: null,
  category: 'tahfidz',
  order: 1,
  is_active: true,
  is_featured: true,
  created_at: null,
}

describe('FeaturedProgramsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no programs', () => {
    useCurriculumsListMock.mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FeaturedProgramsSection />)

    expect(screen.getByText('Belum ada program unggulan.')).toBeInTheDocument()
  })

  it('shows swipe hint when multiple programs on mobile carousel', () => {
    useCurriculumsListMock.mockReturnValue({
      data: {
        data: [
          sampleProgram,
          { ...sampleProgram, id: 2, title: 'Akademik', slug: 'akademik' },
        ],
        meta: { total: 2 },
      },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FeaturedProgramsSection />)

    expect(screen.getByText('Geser untuk melihat program lainnya')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Program Tahfidz/i }).length).toBeGreaterThan(0)
  })

  it('shows Lihat Selengkapnya when total exceeds landing limit', () => {
    useCurriculumsListMock.mockReturnValue({
      data: {
        data: [sampleProgram],
        meta: { total: 8 },
      },
      isLoading: false,
      isFetching: false,
    })

    renderWithProviders(<FeaturedProgramsSection />)

    expect(screen.getByRole('link', { name: /Lihat Selengkapnya/i })).toHaveAttribute(
      'href',
      '/program-unggulan',
    )
  })
})
