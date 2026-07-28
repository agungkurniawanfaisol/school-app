import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { GoogleOAuthApiRescuePage } from '@/pages/admin/GoogleOAuthApiRescuePage'

const { unregisterMock } = vi.hoisted(() => ({
  unregisterMock: vi.fn().mockResolvedValue(true),
}))

vi.mock('@/lib/unregisterLegacyServiceWorkers', () => ({
  unregisterLegacyServiceWorkers: () => unregisterMock(),
  unregisterAllServiceWorkers: () => unregisterMock(),
}))

describe('GoogleOAuthApiRescuePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('clears service workers and reloads the callback URL so Laravel can handle OAuth', async () => {
    const reload = vi.fn()
    vi.stubGlobal('location', {
      href: 'https://nurulhikmahsda.sch.id/api/admin/auth/google/callback?code=abc&state=xyz',
      replace: reload,
    })

    render(
      <MemoryRouter initialEntries={['/api/admin/auth/google/callback?code=abc&state=xyz']}>
        <Routes>
          <Route path="/api/admin/auth/google/callback" element={<GoogleOAuthApiRescuePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('status')).toHaveTextContent(/google|login|oauth|menyelesaikan/i)

    await waitFor(() => {
      expect(unregisterMock).toHaveBeenCalled()
      expect(reload).toHaveBeenCalled()
    })
  })
})
