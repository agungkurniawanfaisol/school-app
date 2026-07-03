import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/hooks/useAuth', () => ({
  useAuthMe: () => ({
    data: { id: 1, name: 'Admin Nurul', email: 'admin@sekolah.id' },
    isLoading: false,
  }),
}))

vi.mock('@/hooks/useNews', () => ({
  useAdminNewsList: () => ({
    data: { data: [{ id: 1, title: 'Berita Demo', category: 'pengumuman', is_active: true, status: 'published' }], meta: { total: 5 } },
    isLoading: false,
  }),
}))

vi.mock('@/hooks/useTeachers', () => ({
  useAdminTeachersList: () => ({
    data: { meta: { total: 8 } },
    isLoading: false,
  }),
}))

vi.mock('@/hooks/useFacilities', () => ({
  useAdminFacilitiesList: () => ({
    data: { meta: { total: 6 } },
    isLoading: false,
  }),
}))

vi.mock('@/hooks/useCurriculums', () => ({
  useAdminCurriculumsList: () => ({
    data: { meta: { total: 4 } },
    isLoading: false,
  }),
}))

vi.mock('@/hooks/usePmb', () => ({
  useAdminPmbRegistrationsList: () => ({
    data: {
      data: [{ id: 1, student_name: 'Ahmad', registration_number: 'PMB-001', status: 'pending' }],
      meta: { total: 2 },
    },
    isLoading: false,
  }),
}))

describe('DashboardPage', () => {
  it('shows welcome hero and stat cards', () => {
    renderWithProviders(<DashboardPage />)

    expect(screen.getByText('Admin Nurul')).toBeInTheDocument()
    expect(screen.getAllByText('Berita').length).toBeGreaterThan(0)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Akses Cepat')).toBeInTheDocument()
    expect(screen.getByText('Berita Terbaru')).toBeInTheDocument()
    expect(screen.getByText('Berita Demo')).toBeInTheDocument()
    expect(screen.getByText('PMB Menunggu Review')).toBeInTheDocument()
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
  })
})
