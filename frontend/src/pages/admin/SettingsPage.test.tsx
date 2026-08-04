import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { LanguageProvider } from '@/components/i18n/LanguageProvider'
import { SettingsPage } from '@/pages/admin/SettingsPage'

vi.mock('@/hooks/useSettings', () => ({
  useAdminSettingsList: () => ({
    isLoading: false,
    data: {
      data: [
        {
          id: 1,
          school_id: 1,
          group: 'pmb',
          key: 'pmb_fee',
          value: 'Rp 350.000',
          type: 'string',
        },
        {
          id: 2,
          school_id: 1,
          group: 'pmb',
          key: 'pmb_bank_name',
          value: 'BSI',
          type: 'string',
        },
        {
          id: 3,
          school_id: 1,
          group: 'pmb',
          key: 'is_open',
          value: 'true',
          type: 'boolean',
        },
      ],
      meta: { current_page: 1, last_page: 1, per_page: 100, total: 3 },
    },
  }),
  useUpdateSetting: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useGmailOAuth', () => ({
  useGmailOAuthStatus: () => ({
    isLoading: false,
    data: {
      client_configured: true,
      connected: false,
      ready_to_send: false,
      from_address: null,
      redirect_uri: 'http://localhost:8000/api/admin/gmail/oauth/callback',
    },
  }),
  useConnectGmailOAuth: () => ({ mutate: vi.fn(), isPending: false }),
  useDisconnectGmailOAuth: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('SettingsPage', () => {
  it('hides pmb fee and bank settings and points admins to the fees page', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <MemoryRouter>
            <SettingsPage />
          </MemoryRouter>
        </LanguageProvider>
      </QueryClientProvider>,
    )

    expect(screen.queryByDisplayValue('Rp 350.000')).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('BSI')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Biaya Pendaftaran PMB/i })).toHaveAttribute(
      'href',
      '/admin/pmb-fees',
    )
  })
})
