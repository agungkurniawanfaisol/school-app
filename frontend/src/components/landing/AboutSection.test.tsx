import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AboutSection } from '@/components/landing/AboutSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useSchoolMock = vi.fn()

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => useSchoolMock(),
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('AboutSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders school name in logo alt text', () => {
    useSchoolMock.mockReturnValue({
      data: {
        name: 'Nurul Hikmah School',
        description: 'Sekolah unggulan.',
        vision: 'Visi sekolah',
        mission: 'Misi sekolah',
      },
      isLoading: false,
    })

    renderWithProviders(<AboutSection />)

    expect(screen.getByAltText('Nurul Hikmah School')).toBeInTheDocument()
    expect(screen.getByText('Sekolah unggulan.')).toBeInTheDocument()
  })
})
