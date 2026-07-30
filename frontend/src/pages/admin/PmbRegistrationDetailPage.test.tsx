import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LanguageProvider } from '@/components/i18n/LanguageProvider'
import { PmbRegistrationDetailPage } from '@/pages/admin/PmbRegistrationDetailPage'

const registration = {
  uuid: 'uuid-1',
  registration_number: 'PMB-001',
  student_name: 'Ahmad',
  birth_place: 'Jakarta',
  birth_date: '2018-01-01',
  gender: 'L',
  academic_year: '2026/2027',
  grade_applied: 'SD',
  previous_school: null,
  address: 'Jl. Merdeka',
  parent_name: 'Budi',
  parent_phone: '+628123',
  parent_email: 'budi@test.id',
  status: 'awaiting_verification',
  notes: null,
  loa_issued_at: null as string | null,
  draft_payload: { nickname: 'Ahmad', student_photo_media_id: 1 },
  student_photo: {
    id: 1,
    uuid: 'photo-uuid',
    url: '/api/v1/pmb/portal/media/photo-uuid?signature=abc',
    mime_type: 'image/jpeg',
    original_name: 'foto.jpg',
  },
  payment_info: {
    proof_media_id: 2,
    proof_url: '/api/v1/pmb/portal/media/proof-uuid?signature=def',
    proof_mime_type: 'image/png',
    proof_name: 'bukti.png',
    note: 'Transfer BSI',
    transferred_at: '2026-07-28',
  },
  messages: [],
}

vi.mock('@/hooks/usePmb', () => ({
  useAdminPmbRegistrationByUuid: () => ({
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
    data: registration,
  }),
  useUpdatePmbByUuid: () => ({ mutate: vi.fn(), isPending: false }),
  useSendPmbEmail: () => ({ mutate: vi.fn(), isPending: false }),
  useAdminPmbMessage: () => ({ mutate: vi.fn(), isPending: false }),
}))

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <MemoryRouter initialEntries={['/admin/pmb-registrations/uuid-1']}>
          <Routes>
            <Route path="/admin/pmb-registrations/:uuid" element={<PmbRegistrationDetailPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  )
}

describe('PmbRegistrationDetailPage', () => {
  beforeEach(() => {
    registration.status = 'awaiting_verification'
    registration.loa_issued_at = null
  })

  it('shows profile header, action panel, and media previews', () => {
    renderPage()

    expect(screen.getByTestId('pmb-profile-header')).toBeInTheDocument()
    expect(screen.getByTestId('pmb-action-panel')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ahmad' })).toBeInTheDocument()
    expect(screen.getByText('PMB-001')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Verifikasi pembayaran/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tolak pembayaran/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Muat ulang/i })).toBeInTheDocument()

    expect(screen.getByRole('img', { name: 'Foto Ahmad' })).toHaveAttribute(
      'src',
      '/api/v1/pmb/portal/media/photo-uuid?signature=abc',
    )
    expect(screen.getByRole('img', { name: 'Bukti pembayaran pendaftaran' })).toHaveAttribute(
      'src',
      '/api/v1/pmb/portal/media/proof-uuid?signature=def',
    )
    expect(screen.getByText(/Transfer BSI/)).toBeInTheDocument()
    expect(screen.getByText('Nama panggilan')).toBeInTheDocument()
  })

  it('hides payment action buttons when status is accepted', () => {
    registration.status = 'accepted'
    renderPage()

    expect(screen.queryByRole('button', { name: /Verifikasi pembayaran/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Tolak pembayaran/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Terbitkan LoA/i })).toBeInTheDocument()
  })

  it('hides LoA button when already issued', () => {
    registration.status = 'accepted'
    registration.loa_issued_at = '2026-07-29T10:00:00+07:00'
    renderPage()

    expect(screen.queryByRole('button', { name: /Terbitkan LoA/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Verifikasi pembayaran/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/Tindakan cepat/i)).not.toBeInTheDocument()
  })
})
