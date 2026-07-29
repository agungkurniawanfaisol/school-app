import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PmbPortalLayout } from '@/pages/pmb/PmbPortalLayout'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({ data: { id: 1 } }),
}))

const registrationMock = vi.hoisted(() => ({
  data: undefined as
    | undefined
    | { uuid: string; status: string },
}))

vi.mock('@/hooks/usePmb', () => ({
  usePmbPortalRegistration: () => ({ data: registrationMock.data }),
  usePmbNotifications: () => ({ data: { unread_count: 0, items: [] }, isLoading: false }),
  useMarkPmbNotificationsRead: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useAuth', () => ({
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
  useAuthMe: () => ({ data: { name: 'Pendaftar', role: 'pendaftar' } }),
}))

const apiMocks = vi.hoisted(() => ({
  getAuthToken: vi.fn(() => null as string | null),
  getStoredUser: vi.fn(() => null as { role: string } | null),
  hasPortalAuth: vi.fn(() => false),
}))

vi.mock('@/lib/api', () => ({
  api: { defaults: { headers: { common: {} } } },
  getAuthToken: apiMocks.getAuthToken,
  getStoredUser: apiMocks.getStoredUser,
  hasPortalAuth: apiMocks.hasPortalAuth,
}))

function renderPortal(initialRoute: string) {
  return renderWithProviders(
    <Routes>
      <Route element={<PmbPortalLayout />}>
        <Route path="/pmb/daftar" element={<div>Wizard content</div>} />
        <Route path="/pmb/portal/pendaftaran/:uuid" element={<div>Detail status</div>} />
        <Route path="/pmb/portal/testimoni" element={<div>Testimoni</div>} />
      </Route>
      <Route path="/admin" element={<div>Admin home</div>} />
    </Routes>,
    { route: initialRoute },
  )
}

describe('PmbPortalLayout', () => {
  beforeEach(() => {
    registrationMock.data = undefined
    apiMocks.getAuthToken.mockReturnValue(null)
    apiMocks.getStoredUser.mockReturnValue(null)
    apiMocks.hasPortalAuth.mockReturnValue(false)
  })

  it('allows guests on register route', () => {
    const { getByText } = renderPortal('/pmb/daftar')

    expect(getByText('Wizard content')).toBeInTheDocument()
    expect(getByText('Portal PMB')).toBeInTheDocument()
  })

  it('redirects guests from portal detail to register', () => {
    const { getByText } = renderPortal('/pmb/portal/pendaftaran/uuid-1')

    expect(getByText('Wizard content')).toBeInTheDocument()
  })

  it('redirects non-pendaftar to admin', () => {
    apiMocks.getAuthToken.mockReturnValue('token')
    apiMocks.getStoredUser.mockReturnValue({ role: 'admin' })
    apiMocks.hasPortalAuth.mockReturnValue(false)

    const { getByText } = renderPortal('/pmb/daftar')

    expect(getByText('Admin home')).toBeInTheDocument()
  })

  it('shows status page after submit instead of bouncing draft back to wizard', () => {
    apiMocks.getAuthToken.mockReturnValue('token')
    apiMocks.getStoredUser.mockReturnValue({ role: 'pendaftar' })
    apiMocks.hasPortalAuth.mockReturnValue(true)
    registrationMock.data = {
      uuid: 'uuid-submitted',
      status: 'awaiting_verification',
    }

    const { getByText, queryByText } = renderPortal('/pmb/portal/pendaftaran/uuid-submitted')

    expect(getByText('Detail status')).toBeInTheDocument()
    expect(queryByText('Wizard content')).not.toBeInTheDocument()
  })

  it('redirects draft registration away from detail route', () => {
    apiMocks.getAuthToken.mockReturnValue('token')
    apiMocks.getStoredUser.mockReturnValue({ role: 'pendaftar' })
    apiMocks.hasPortalAuth.mockReturnValue(true)
    registrationMock.data = {
      uuid: 'uuid-draft',
      status: 'draft',
    }

    const { getByText } = renderPortal('/pmb/portal/pendaftaran/uuid-draft')

    expect(getByText('Wizard content')).toBeInTheDocument()
  })
})
