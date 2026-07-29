import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { LanguageProvider } from '@/components/i18n/LanguageProvider'
import { PmbFeesListPage } from '@/pages/admin/PmbFeesListPage'

vi.mock('@/hooks/usePmbFees', () => ({
  useAdminPmbFeesList: () => ({
    isLoading: false,
    isFetching: false,
    data: {
      data: [
        {
          id: 1,
          uuid: 'fee-1',
          school_id: 1,
          academic_year_id: 1,
          academic_year: { id: 1, uuid: 'y1', label: '2026/2027', is_active: true },
          amount: 350000,
          amount_formatted: 'Rp 350.000',
          is_active: true,
          notes: null,
          created_at: null,
          updated_at: null,
        },
        {
          id: 2,
          uuid: 'fee-2',
          school_id: 1,
          academic_year_id: 2,
          academic_year: { id: 2, uuid: 'y2', label: '2025/2026', is_active: false },
          amount: 300000,
          amount_formatted: 'Rp 300.000',
          is_active: false,
          notes: null,
          created_at: null,
          updated_at: null,
        },
      ],
      meta: { current_page: 1, last_page: 1, per_page: 15, total: 2 },
    },
  }),
  useDeletePmbFee: () => ({ mutate: vi.fn(), isPending: false }),
  useActivatePmbFee: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useSettings', () => ({
  usePublicSettings: () => ({
    data: [
      { key: 'pmb_bank_name', value: 'Bank Syariah Indonesia (BSI)' },
      { key: 'pmb_account_number', value: '7123456789' },
      { key: 'pmb_account_holder', value: 'Yayasan Nurul Hikmah' },
    ],
  }),
}))

describe('PmbFeesListPage', () => {
  it('lists fees, shows bank banner, and exposes actions for active fees', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <MemoryRouter>
            <PmbFeesListPage />
          </MemoryRouter>
        </LanguageProvider>
      </QueryClientProvider>,
    )

    expect(screen.getAllByText('Rp 350.000').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2025/2026').length).toBeGreaterThan(0)
    expect(screen.getByText('Bank Syariah Indonesia (BSI)')).toBeInTheDocument()
    expect(screen.getByText('7123456789')).toBeInTheDocument()
    expect(screen.getByText('Yayasan Nurul Hikmah')).toBeInTheDocument()
    expect(document.querySelector('a[href*="/edit"]')).toBeNull()
    expect(document.querySelector('a[href="/admin/pmb-fees/create"]')).not.toBeNull()
    expect(document.querySelector('a[href="/admin/settings"]')).not.toBeNull()

    // Active + inactive rows both expose the actions menu (delete always available).
    // Desktop table + mobile cards may both mount action triggers.
    expect(screen.getAllByLabelText('Aksi lainnya').length).toBeGreaterThanOrEqual(2)
  })
})
