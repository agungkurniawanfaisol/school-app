import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { SplashScreenPage } from '@/pages/admin/SplashScreenPage'
import { DEFAULT_SPLASH_SCREEN } from '@/schemas/splashScreen'
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

describe('SplashScreenPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSchoolMock.mockReturnValue({ data: { id: 1, name: 'Nurul Hikmah' }, isLoading: false })
    useAdminSettingsListMock.mockReturnValue({
      data: {
        data: [
          {
            id: 11,
            school_id: 1,
            group: 'homepage',
            key: 'splash_screen',
            type: 'json',
            value: JSON.stringify(DEFAULT_SPLASH_SCREEN),
          },
        ],
      },
      isLoading: false,
    })
    useCreateSettingMock.mockReturnValue({ mutate: vi.fn(), isPending: false })
    useUpdateSettingMock.mockReturnValue({ mutate: vi.fn(), isPending: false })
  })

  it('renders splash form fields', () => {
    renderWithProviders(<SplashScreenPage />, {
      route: '/admin/splash-screen',
      path: '/admin/splash-screen',
    })

    expect(screen.getByRole('heading', { name: 'Splash Beranda' })).toBeInTheDocument()
    expect(screen.getByLabelText('Judul utama')).toHaveValue(DEFAULT_SPLASH_SCREEN.title)
    expect(screen.getByLabelText('Durasi tampil (ms)')).toHaveValue(DEFAULT_SPLASH_SCREEN.duration_ms)
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument()
  })
})
