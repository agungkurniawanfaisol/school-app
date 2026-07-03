import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { OAuthCallbackPage } from '@/pages/admin/OAuthCallbackPage'

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
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/admin/login/oauth" element={<OAuthCallbackPage />} />
        <Route path="/admin/login" element={<div>Login</div>} />
        <Route path="/admin" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('OAuthCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    window.history.replaceState(null, '', '/admin/login/oauth')
  })

  it('exchanges ticket from hash on mount', async () => {
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

    expect(screen.getByText('Menyelesaikan login...')).toBeInTheDocument()
  })
})
