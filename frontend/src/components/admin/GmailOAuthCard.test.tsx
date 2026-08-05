import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { GmailOAuthCard } from '@/components/admin/GmailOAuthCard'

vi.mock('@/hooks/useGmailOAuth', () => ({
  useGmailOAuthStatus: () => ({
    isLoading: false,
    data: {
      client_configured: true,
      connected: true,
      ready_to_send: true,
      from_address: 'pmb@example.com',
      redirect_uri: 'http://localhost:8000/api/admin/gmail/oauth/callback',
    },
  }),
  useConnectGmailOAuth: () => ({ mutate: vi.fn(), isPending: false }),
  useDisconnectGmailOAuth: () => ({ mutate: vi.fn(), isPending: false }),
  useSendGmailTest: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('GmailOAuthCard', () => {
  it('shows connect button and send-test form when ready', () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    render(
      <QueryClientProvider client={client}>
        <GmailOAuthCard />
      </QueryClientProvider>,
    )

    expect(screen.getByTestId('gmail-oauth-card')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hubungkan ulang/i })).toBeInTheDocument()
    expect(screen.getByText(/Siap mengirim/i)).toBeInTheDocument()
    expect(screen.getByTestId('gmail-send-test-form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Kirim Gmail$/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Kepada/i)).toBeInTheDocument()
  })
})
