import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PmbRegisterPage } from '@/pages/pmb/PmbRegisterPage'
import { LanguageProvider } from '@/components/i18n/LanguageProvider'

const apiMocks = vi.hoisted(() => ({
  hasPortalAuth: vi.fn(() => false),
  getAuthToken: vi.fn(() => null as string | null),
  getStoredUser: vi.fn(() => null as { role: string } | null),
}))

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>()
  return {
    ...actual,
    hasPortalAuth: () => apiMocks.hasPortalAuth(),
    getAuthToken: () => apiMocks.getAuthToken(),
    getStoredUser: () => apiMocks.getStoredUser(),
  }
})

const registrationMock = vi.hoisted(() => ({
  data: undefined as undefined | Record<string, unknown>,
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuthMe: () => ({
    data: apiMocks.getStoredUser() ? { name: 'Pendaftar', role: 'pendaftar' } : null,
  }),
  authKeys: { me: () => ['auth', 'me'] },
}))

vi.mock('@/hooks/usePmb', () => ({
  usePmbPortalRegistration: () => ({ data: registrationMock.data }),
  usePmbSettings: () => ({ data: [] }),
  useSavePmbDraft: () => ({ mutate: vi.fn() }),
  useSubmitPmbRegistration: () => ({ mutate: vi.fn(), isPending: false }),
  useSubmitPmbCorrection: () => ({ mutate: vi.fn(), isPending: false }),
  usePmbPortalUpload: () => ({ mutate: vi.fn(), isPending: false, progress: 0, phase: 'idle' }),
}))

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({ data: { id: 1, name: 'Nurul Hikmah' } }),
}))

vi.mock('@/hooks/useAcademicYears', () => ({
  useActiveAcademicYear: () => ({ data: { label: '2026/2027' } }),
}))

function renderRegister() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <MemoryRouter initialEntries={['/pmb/daftar']}>
          <Routes>
            <Route path="/pmb/daftar" element={<PmbRegisterPage />} />
            <Route path="/admin/login" element={<div>Halaman masuk</div>} />
            <Route path="/pmb/portal/pendaftaran/:uuid" element={<div>Halaman status</div>} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  )
}

describe('PmbRegisterPage', () => {
  it('redirects guests to unified login', () => {
    apiMocks.hasPortalAuth.mockReturnValue(false)
    apiMocks.getAuthToken.mockReturnValue(null)
    apiMocks.getStoredUser.mockReturnValue(null)
    registrationMock.data = undefined

    renderRegister()

    expect(screen.getByText('Halaman masuk')).toBeInTheDocument()
    expect(screen.queryByText('Langkah 1 dari 4')).not.toBeInTheDocument()
  })

  it('shows read-only data view after submit instead of redirecting away', () => {
    apiMocks.hasPortalAuth.mockReturnValue(true)
    apiMocks.getAuthToken.mockReturnValue('token')
    apiMocks.getStoredUser.mockReturnValue({ role: 'pendaftar' })
    registrationMock.data = {
      uuid: '559d5330-bd8b-48d4-b7e7-2b3d8f6ae6b4',
      registration_number: 'PMB-2026-001',
      status: 'awaiting_verification',
      student_name: 'Ahmad',
      academic_year: '2026/2027',
      draft_payload: {
        nickname: 'Mad',
        father_name: 'Budi',
        mother_name: 'Siti',
        student_photo_media_id: 1,
      },
      payment_info: {
        proof_media_id: 2,
        proof_url: '/api/v1/pmb/portal/media/proof?signature=x',
        proof_mime_type: 'image/png',
        note: 'Transfer BSI',
        transferred_at: '2026-07-28',
      },
      student_photo: {
        url: '/api/v1/pmb/portal/media/photo?signature=y',
        mime_type: 'image/jpeg',
      },
    }

    renderRegister()

    expect(screen.getByRole('heading', { name: 'Data Pendaftaran' })).toBeInTheDocument()
    expect(screen.getByText(/Pendaftaran sudah dikirim/)).toBeInTheDocument()
    expect(screen.queryByText(/Perlu perbaikan/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Kirim perbaikan/i })).not.toBeInTheDocument()
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Lihat status & timeline/i })).toHaveAttribute(
      'href',
      '/pmb/portal/pendaftaran/559d5330-bd8b-48d4-b7e7-2b3d8f6ae6b4',
    )
    expect(screen.queryByText('Halaman status')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Kirim Pendaftaran/i })).not.toBeInTheDocument()
  })

  it('shows perbaikan copy only when status is needs_revision', () => {
    apiMocks.hasPortalAuth.mockReturnValue(true)
    apiMocks.getAuthToken.mockReturnValue('token')
    apiMocks.getStoredUser.mockReturnValue({ role: 'pendaftar' })
    registrationMock.data = {
      uuid: 'a57d290e-e82d-4e1a-843e-8342e21c09a7',
      registration_number: 'PMB-20260729-TASVVS',
      status: 'needs_revision',
      current_step: 5,
      student_name: 'Ahmad',
      academic_year: '2026/2027',
      draft_payload: {
        nickname: 'Mad',
        father_name: 'Budi',
        mother_name: 'Siti',
        student_photo_media_id: 1,
        transfer_confirmed: true,
      },
      payment_info: {
        proof_media_id: 2,
        proof_url: '/api/v1/pmb/portal/media/proof?signature=x',
      },
    }

    renderRegister()

    expect(screen.getByRole('heading', { name: 'Perbaiki Data Pendaftaran' })).toBeInTheDocument()
    expect(screen.getAllByText(/Perlu perbaikan/).length).toBeGreaterThan(0)
    expect(
      screen.getByText(/Admin meminta perbaikan\. Pendaftar dapat mengedit data\/bukti/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Data Diri' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ganti Foto|Unggah Foto/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Lanjut/i })).toBeInTheDocument()
  })
})
