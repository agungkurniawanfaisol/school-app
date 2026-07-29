import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PmbPortalDetailPage } from '@/pages/pmb/PmbPortalDetailPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const refetch = vi.fn()

const detailMock = vi.fn()

vi.mock('@/hooks/usePmb', () => ({
  usePmbPortalDetail: () => detailMock(),
  usePmbPortalMessage: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({ data: { name: 'Sekolah Nurul Hikmah', logo: null } }),
}))

vi.mock('@/lib/api', () => ({
  SCHOOL_SLUG: 'nurul-hikmah',
  api: { defaults: { headers: {} } },
  getAuthToken: () => 'token',
  getStoredUser: () => ({ role: 'pendaftar' }),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

describe('PmbPortalDetailPage', () => {
  beforeEach(() => {
    localStorage.clear()
    detailMock.mockReturnValue({
      isLoading: false,
      isFetching: false,
      refetch,
      data: {
        uuid: 'registration-uuid',
        registration_number: 'PMB-001',
        status: 'needs_revision',
        student_name: 'Ahmad',
        current_step: 5,
        events: [],
        messages: [],
        loa_media_id: null,
        parent_name: 'Budi',
        parent_phone: '0812',
        parent_email: null,
        address: 'Jl. A',
        previous_school: null,
        grade_applied: 'KB',
        gender: 'L',
        birth_place: 'Sidoarjo',
        birth_date: '2018-01-01',
        draft_payload: {},
        created_at: null,
        updated_at: null,
      },
    })
  })

  it('renders registration summary, timeline, formulir, and LoA placeholder when not accepted', () => {
    renderWithProviders(<PmbPortalDetailPage />)
    expect(screen.getByText('Pendaftaran PMB-001')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Proses pendaftaran' })).toBeInTheDocument()
    expect(screen.getByText(/LoA tersedia setelah pendaftaran diterima/)).toBeInTheDocument()
    expect(document.getElementById('pesan')).toBeInTheDocument()
    expect(document.getElementById('loa')).toBeInTheDocument()
    expect(document.getElementById('formulir')).toBeInTheDocument()
    expect(screen.queryByTestId('pmb-accepted-celebration')).not.toBeInTheDocument()
  })

  it('shows celebration and LoA document when accepted', () => {
    detailMock.mockReturnValue({
      isLoading: false,
      isFetching: false,
      refetch,
      data: {
        uuid: 'accepted-uuid',
        registration_number: 'PMB-099',
        status: 'accepted',
        student_name: 'Samuel',
        current_step: 5,
        events: [],
        messages: [],
        loa_issued_at: '2026-07-29T10:00:00Z',
        loa_media_id: null,
        parent_name: 'Budi',
        parent_phone: '0812',
        parent_email: null,
        address: 'Jl. A',
        previous_school: null,
        grade_applied: 'KB',
        gender: 'L',
        birth_place: 'Sidoarjo',
        birth_date: '2018-01-01',
        academic_year: '2026-2027',
        draft_payload: { nickname: 'Sam' },
        created_at: '2026-07-01T00:00:00Z',
        updated_at: '2026-07-29T10:00:00Z',
      },
    })

    renderWithProviders(<PmbPortalDetailPage />)
    expect(screen.getByTestId('pmb-accepted-celebration')).toBeInTheDocument()
    expect(screen.getByTestId('pmb-loa-document')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Simpan LoA (PDF)' })).toBeEnabled()

  })

  it('refetches registration when refresh is clicked', () => {
    renderWithProviders(<PmbPortalDetailPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Muat ulang' }))
    expect(refetch).toHaveBeenCalled()
  })
})
