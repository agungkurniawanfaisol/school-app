import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { HeroCollagePage } from '@/pages/admin/HeroCollagePage'
import { DEFAULT_HERO_COLLAGE } from '@/schemas/heroCollage'
import { renderWithProviders } from '@/test/renderWithProviders'

const {
  useSchoolMock,
  useAdminSettingsListMock,
  useCreateSettingMock,
  useUpdateSettingMock,
} = vi.hoisted(() => ({
  useSchoolMock: vi.fn(),
  useAdminSettingsListMock: vi.fn(),
  useCreateSettingMock: vi.fn(),
  useUpdateSettingMock: vi.fn(),
}))

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => useSchoolMock(),
}))

vi.mock('@/hooks/useSettings', () => ({
  useAdminSettingsList: () => useAdminSettingsListMock(),
  useCreateSetting: () => useCreateSettingMock(),
  useUpdateSetting: (id: number) => useUpdateSettingMock(id),
}))

describe('HeroCollagePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSchoolMock.mockReturnValue({ data: { id: 1, name: 'Nurul Hikmah' }, isLoading: false })
    useAdminSettingsListMock.mockReturnValue({
      data: {
        data: [
          {
            id: 10,
            school_id: 1,
            group: 'homepage',
            key: 'hero_collage',
            type: 'json',
            value: JSON.stringify(DEFAULT_HERO_COLLAGE),
          },
        ],
      },
      isLoading: false,
    })
    useCreateSettingMock.mockReturnValue({ mutate: vi.fn(), isPending: false })
    useUpdateSettingMock.mockReturnValue({ mutate: vi.fn(), isPending: false })
  })

  it('renders title and four collage item fields', () => {
    renderWithProviders(<HeroCollagePage />, {
      route: '/admin/hero-collage',
      path: '/admin/hero-collage',
    })

    expect(screen.getByRole('heading', { name: 'Collage Hero TAKK' })).toBeInTheDocument()
    expect(screen.getByLabelText('Caption di bawah kotak')).toHaveValue(DEFAULT_HERO_COLLAGE.subtitle)
    expect(screen.getByText('Kotak 1')).toBeInTheDocument()
    expect(screen.getByText('Kotak 2')).toBeInTheDocument()
    expect(screen.getByText('Kotak 3')).toBeInTheDocument()
    expect(screen.getByText('Kotak 4')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Tahfidz')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument()
  })
})
