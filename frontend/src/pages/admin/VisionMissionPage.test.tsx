import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { VisionMissionPage } from '@/pages/admin/VisionMissionPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useSchoolMock = vi.fn()
const useUpdateSchoolMock = vi.fn()

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => useSchoolMock(),
  useUpdateSchool: (id: number) => useUpdateSchoolMock(id),
}))

const school = {
  id: 1,
  name: 'Nurul Hikmah',
  slug: 'nurul-hikmah',
  tagline: null,
  description: null,
  logo: null,
  favicon: null,
  email: null,
  phone: null,
  whatsapp: null,
  address: null,
  city: null,
  province: null,
  postal_code: null,
  vision: 'Visi lama',
  mission: 'Misi lama',
  is_active: true,
}

describe('VisionMissionPage', () => {
  const mutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useSchoolMock.mockReturnValue({ data: school, isLoading: false, isError: false })
    useUpdateSchoolMock.mockReturnValue({ mutate, isPending: false })
  })

  it('renders form with vision and mission fields', () => {
    renderWithProviders(<VisionMissionPage />, { route: '/admin/vision-mission', path: '/admin/vision-mission' })

    expect(screen.getByRole('heading', { name: 'Visi & Misi' })).toBeInTheDocument()
    expect(screen.getByLabelText('Visi')).toHaveValue('Visi lama')
    expect(screen.getAllByText('Misi').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Pratinjau Beranda')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Pratinjau visi dan misi' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument()
  })

  it('submits updated vision and mission', async () => {
    renderWithProviders(<VisionMissionPage />, { route: '/admin/vision-mission', path: '/admin/vision-mission' })

    await waitFor(() => {
      expect(screen.getByLabelText('Visi')).toHaveValue('Visi lama')
    })

    fireEvent.change(screen.getByLabelText('Visi'), { target: { value: 'Visi baru' } })
    fireEvent.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({
        vision: 'Visi baru',
        mission: 'Misi lama',
      })
    })
    expect(useUpdateSchoolMock).toHaveBeenCalledWith(1)
  })
})
