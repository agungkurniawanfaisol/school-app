import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from '@/components/i18n/LanguageProvider'
import {
  OAuthCallbackPage,
  resetOAuthExchangeLockForTests,
} from '@/pages/admin/OAuthCallbackPage'

const { mutateMock } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
}))

vi.mock('@/hooks/useAuth', () => ({
  useGoogleExchange: () => ({
    mutate: mutateMock,
    isPending: true,
  }),
  useAuthMe: () => ({
    data: undefined,
    isSuccess: false,
    isError: false,
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function renderOAuthCallback(initialEntry: string) {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/admin/login/oauth" element={<OAuthCallbackPage />} />
          <Route path="/admin/login" element={<div>Login</div>} />
          <Route path="/admin" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('OAuthCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    resetOAuthExchangeLockForTests()
    window.history.replaceState(null, '', '/admin/login/oauth')
  })

  it('exchanges ticket from query string on mount', async () => {
    renderOAuthCallback('/admin/login/oauth?ticket=11111111-1111-1111-1111-111111111111')

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        '11111111-1111-1111-1111-111111111111',
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      )
    })

    expect(screen.getByText('Menyelesaikan login...')).toBeInTheDocument()
  })

  it('exchanges ticket from hash on mount (legacy)', async () => {
    window.location.hash = '#ticket=11111111-1111-1111-1111-111111111111'

    renderOAuthCallback('/admin/login/oauth#ticket=11111111-1111-1111-1111-111111111111')

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        '11111111-1111-1111-1111-111111111111',
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      )
    })
  })

  it('exchanges ticket from sessionStorage when URL query was cleared', async () => {
    sessionStorage.setItem('nh_oauth_ticket_pending', '22222222-2222-2222-2222-222222222222')

    renderOAuthCallback('/admin/login/oauth')

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        '22222222-2222-2222-2222-222222222222',
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      )
    })
  })

  it('does not start a second exchange for the same ticket (Strict Mode remount)', async () => {
    const ticket = '33333333-3333-3333-3333-333333333333'
    // Simulate first mount already started exchange for this ticket.
    sessionStorage.setItem('nh_oauth_ticket_pending', ticket)
    resetOAuthExchangeLockForTests()
    // Prime the module lock by rendering once, then render again.
    const first = renderOAuthCallback(`/admin/login/oauth?ticket=${ticket}`)
    await waitFor(() => expect(mutateMock).toHaveBeenCalledTimes(1))
    first.unmount()

    mutateMock.mockClear()
    renderOAuthCallback(`/admin/login/oauth?ticket=${ticket}`)

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    expect(mutateMock).not.toHaveBeenCalled()
  })
})
