import { fireEvent, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { Form } from '@/components/ui/form'
import { PmbWizardStepDataDiri } from '@/components/pmb/PmbWizardStepDataDiri'
import type { PmbPortalDraftValues } from '@/schemas/pmb'

vi.mock('@/components/pmb/PmbStudentPhotoUpload', () => ({
  PmbStudentPhotoUpload: () => <div data-testid="photo-upload" />,
}))

function Harness() {
  const form = useForm<PmbPortalDraftValues>({
    defaultValues: {
      student_name: '',
      relationship_to_child: undefined,
      relationship_to_child_other: '',
    },
  })

  return (
    <Form {...form}>
      <PmbWizardStepDataDiri
        form={form}
        upload={{ mutate: vi.fn(), isPending: false } as never}
        onPhotoUploaded={vi.fn()}
      />
    </Form>
  )
}

describe('PmbWizardStepDataDiri status anak', () => {
  it('uses stable button choices instead of select dropdown', () => {
    render(<Harness />)

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Status anak' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'Anak kandung' }))
    expect(screen.getByRole('radio', { name: 'Anak kandung' })).toHaveAttribute('aria-checked', 'true')

    fireEvent.click(screen.getByRole('radio', { name: 'Lainnya' }))
    expect(screen.getByRole('radio', { name: 'Lainnya' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByPlaceholderText('Contoh: Anak angkat, Anak asuh')).toBeVisible()
  })
})
