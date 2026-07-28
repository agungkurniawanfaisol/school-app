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
        about_image: 'https://cdn.example.com/about.jpg',
      },
      isLoading: false,
    })

    renderWithProviders(<AboutSection />)

    const image = screen.getByAltText('Nurul Hikmah School')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/about.jpg')
    expect(screen.getByText('Sekolah unggulan.')).toBeInTheDocument()
  })
})
