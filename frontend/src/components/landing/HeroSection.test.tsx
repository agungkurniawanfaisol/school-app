import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { HeroSection } from '@/components/landing/HeroSection'
import { DEFAULT_HERO_COLLAGE } from '@/schemas/heroCollage'
import { renderWithProviders } from '@/test/renderWithProviders'

const { useSchoolMock, useHeroCollageMock, apiGet } = vi.hoisted(() => ({
  useSchoolMock: vi.fn(),
  useHeroCollageMock: vi.fn(),
  apiGet: vi.fn(),
}))

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => useSchoolMock(),
}))

vi.mock('@/hooks/useSettings', () => ({
  useHeroCollage: () => useHeroCollageMock(),
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
    useHeroCollageMock.mockReturnValue({ collage: null, isLoading: false })
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

    const headings = await screen.findAllByText(/Membentuk Generasi Qurani/)
    expect(headings.length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Berakhlak Mulia/).length).toBeGreaterThan(0)
  })

  it('renders collage labels from API when available', async () => {
    useSchoolMock.mockReturnValue({
      data: { name: 'Nurul Hikmah School', tagline: 'Sekolah Islam Terpadu' },
      isLoading: false,
    })
    useHeroCollageMock.mockReturnValue({
      collage: {
        ...DEFAULT_HERO_COLLAGE,
        subtitle: 'Caption dari API',
        items: [
          { letter: 'T', label: 'Tahfidz API', color: 'from-primary/30 to-primary/10' },
          { letter: 'A', label: 'Akademik API', color: 'from-primary/40 to-primary/10' },
          { letter: 'K', label: 'Karakter API', color: 'from-[var(--gold-accent)]/30 to-primary/10' },
          { letter: 'K', label: 'Kegiatan API', color: 'from-primary/25 to-accent/40' },
        ],
      },
      isLoading: false,
    })

    renderWithProviders(<HeroSection />)

    expect(await screen.findByText('Tahfidz API')).toBeInTheDocument()
    expect(screen.getByText('Akademik API')).toBeInTheDocument()
    expect(screen.getByText('Karakter API')).toBeInTheDocument()
    expect(screen.getByText('Kegiatan API')).toBeInTheDocument()
    expect(screen.getAllByText('Caption dari API').length).toBeGreaterThan(0)
  })

  it('shows dot indicators when multiple slides are loaded', async () => {
    useSchoolMock.mockReturnValue({
      data: { name: 'Nurul Hikmah School', tagline: 'Sekolah Islam Terpadu' },
      isLoading: false,
    })
    apiGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            title: 'Slide Satu',
            subtitle: 'Sub 1',
            image: 'https://example.com/1.jpg',
            cta_text: 'CTA',
            cta_url: '/pmb',
          },
          {
            id: 2,
            title: 'Slide Dua',
            subtitle: 'Sub 2',
            image: 'https://example.com/2.jpg',
            cta_text: 'CTA',
            cta_url: '/kursus',
          },
        ],
      },
    })

    renderWithProviders(<HeroSection />)

    expect(await screen.findByRole('tablist', { name: 'Indikator slide' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Slide 1 dari 2' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Slide 2 dari 2' })).toBeInTheDocument()
  })
})
