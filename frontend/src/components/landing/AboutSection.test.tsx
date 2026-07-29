import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AboutSection } from '@/components/landing/AboutSection'
import { renderWithProviders } from '@/test/renderWithProviders'

const useSchoolMock = vi.fn()
const useSchoolValuesListMock = vi.fn()
const useSchoolStatsListMock = vi.fn()

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => useSchoolMock(),
}))

vi.mock('@/hooks/useSchoolValues', () => ({
  useSchoolValuesList: () => useSchoolValuesListMock(),
}))

vi.mock('@/hooks/useSchoolStats', () => ({
  useSchoolStatsList: () => useSchoolStatsListMock(),
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
    useSchoolValuesListMock.mockReturnValue({
      data: {
        data: [
          {
            uuid: 'value-1',
            school_id: 1,
            icon: 'heart',
            title: 'Akhlak',
            description: 'Membentuk karakter mulia.',
            order: 1,
            is_active: true,
          },
        ],
      },
    })
    useSchoolStatsListMock.mockReturnValue({
      data: {
        data: [
          {
            uuid: 'stat-1',
            school_id: 1,
            icon: 'graduation-cap',
            label: 'Berdiri',
            value: '1998',
            order: 1,
            is_active: true,
          },
          {
            uuid: 'stat-2',
            school_id: 1,
            icon: 'users',
            label: 'Siswa',
            value: '500+',
            order: 2,
            is_active: true,
          },
        ],
      },
    })
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

  it('renders school values from API', () => {
    useSchoolMock.mockReturnValue({
      data: {
        name: 'Nurul Hikmah School',
        description: 'Sekolah unggulan.',
      },
      isLoading: false,
    })

    renderWithProviders(<AboutSection />)

    expect(screen.getByText('Akhlak')).toBeInTheDocument()
    expect(screen.getByText('Membentuk karakter mulia.')).toBeInTheDocument()
  })

  it('renders school stats from API', () => {
    useSchoolMock.mockReturnValue({
      data: {
        name: 'Nurul Hikmah School',
        description: 'Sekolah unggulan.',
      },
      isLoading: false,
    })

    renderWithProviders(<AboutSection />)

    expect(screen.getByText('Berdiri')).toBeInTheDocument()
    expect(screen.getByText('1998')).toBeInTheDocument()
    expect(screen.getByText('Siswa')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
  })

  it('hides stats strip when empty', () => {
    useSchoolStatsListMock.mockReturnValue({ data: { data: [] } })
    useSchoolMock.mockReturnValue({
      data: {
        name: 'Nurul Hikmah School',
        description: 'Sekolah unggulan.',
      },
      isLoading: false,
    })

    renderWithProviders(<AboutSection />)

    expect(screen.queryByText('Berdiri')).not.toBeInTheDocument()
    expect(screen.queryByText('1998')).not.toBeInTheDocument()
  })
})
