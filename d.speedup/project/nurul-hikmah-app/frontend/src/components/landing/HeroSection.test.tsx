import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { HeroSection } from '@/components/landing/HeroSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const { useSchoolMock, apiGet } = vi.hoisted(() => ({
  useSchoolMock: vi.fn(),
  apiGet: vi.fn(),
}))

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => useSchoolMock(),
}))

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api')>('@/lib/api')
  return {
    ...actual,
    api: { get: apiGet },
  }
})

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiGet.mockResolvedValue({ data: { data: [] } })
  })

  it('shows loading skeleton while data is loading', () => {
    useSchoolMock.mockReturnValue({ data: undefined, isLoading: true })

    const { container } = renderWithProviders(<HeroSection />)

    expect(container.querySelector('.skeleton-shimmer')).toBeInTheDocument()
  })

  it('renders headline when school data is loaded', async () => {
    useSchoolMock.mockReturnValue({
      data: { name: 'Nurul Hikmah School', tagline: 'Sekolah Islam Terpadu' },
      isLoading: false,
    })

    renderWithProviders(<HeroSection />)

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      'Membentuk Generasi Qurani & Berakhlak Mulia',
    )
  })
})
