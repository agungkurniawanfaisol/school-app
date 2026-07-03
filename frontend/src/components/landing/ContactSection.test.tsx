import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ContactSection } from '@/components/landing/ContactSection'
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

describe('ContactSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders school contact information', () => {
    useSchoolMock.mockReturnValue({
      data: {
        name: 'Nurul Hikmah School',
        email: 'info@nurulhikmah.sch.id',
        phone: '0211234567',
        address: 'Jl. Pendidikan No. 1',
        city: 'Jakarta',
      },
      isLoading: false,
    })

    renderWithProviders(<ContactSection />)

    expect(screen.getByText('Hubungi Kami')).toBeInTheDocument()
    expect(screen.getByText('info@nurulhikmah.sch.id')).toBeInTheDocument()
    expect(screen.getByText('0211234567')).toBeInTheDocument()
  })
})
