import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbWizardStepper } from '@/components/pmb/PmbWizardStepper'

describe('PmbWizardStepper', () => {
  it('shows current step progress', () => {
    render(<PmbWizardStepper currentStep={0} />)

    expect(screen.getByText(/Langkah 1 dari 4/)).toBeInTheDocument()
    expect(screen.getAllByText('Data Diri').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Langkah pendaftaran')).toBeInTheDocument()
  })

  it('shows sidebar progress variant', () => {
    render(<PmbWizardStepper currentStep={1} variant="sidebar" />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText(/Langkah 2 dari 4/)).toBeInTheDocument()
    expect(screen.getByText('Orang Tua')).toBeInTheDocument()
  })

  it('allows jumping to a step when onStepSelect is provided', () => {
    const onStepSelect = vi.fn()
    render(<PmbWizardStepper currentStep={2} onStepSelect={onStepSelect} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Ke langkah Data Diri' })[0])
    expect(onStepSelect).toHaveBeenCalledWith(0)
  })
})
