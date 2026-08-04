import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useForm } from 'react-hook-form'
import { PmbWizardStepPembayaran } from '@/components/pmb/PmbWizardStepPembayaran'
import { Form } from '@/components/ui/form'
import type { PmbFee } from '@/hooks/usePmbFees'
import type { PmbPortalDraftValues } from '@/schemas/pmb'
import { renderWithProviders } from '@/test/renderWithProviders'

afterEach(() => cleanup())

const fees: PmbFee[] = [
  {
    id: 1,
    uuid: '11111111-1111-1111-1111-111111111111',
    school_id: 1,
    academic_year_id: 1,
    name: 'TK Reguler',
    jenjang: 'tk',
    program: 'reguler',
    amount: 250000,
    amount_formatted: 'Rp 250.000',
    bank_name: 'BSI',
    account_number: '111',
    account_holder: 'Yayasan TK',
    is_active: true,
    created_at: null,
    updated_at: null,
  },
  {
    id: 2,
    uuid: '22222222-2222-2222-2222-222222222222',
    school_id: 1,
    academic_year_id: 1,
    name: 'SD ICP',
    jenjang: 'sd',
    program: 'icp',
    amount: 450000,
    amount_formatted: 'Rp 450.000',
    bank_name: 'BSI',
    account_number: '999',
    account_holder: 'Yayasan SD',
    is_active: true,
    created_at: null,
    updated_at: null,
  },
]

function Harness() {
  const form = useForm<PmbPortalDraftValues>({
    defaultValues: { student_name: 'Ahmad', transfer_confirmed: false },
  })
  const upload = {
    mutate: vi.fn(),
    isPending: false,
    progress: 0,
    phase: 'idle' as const,
  }

  return (
    <Form {...form}>
      <PmbWizardStepPembayaran form={form} fees={fees} upload={upload as never} />
    </Form>
  )
}

describe('PmbWizardStepPembayaran fee selection', () => {
  it('requires jenjang then program before showing transfer details', () => {
    renderWithProviders(<Harness />)

    expect(screen.queryByText('999')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'SD' }))
    fireEvent.click(screen.getByRole('button', { name: /ICP/i }))

    expect(screen.getAllByText('Rp 450.000').length).toBeGreaterThan(0)
    expect(screen.getByText('999')).toBeInTheDocument()
    expect(screen.getByText('Yayasan SD')).toBeInTheDocument()
  })
})
