import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PmbAcceptedCelebration } from '@/components/pmb/PmbAcceptedCelebration'

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

describe('PmbAcceptedCelebration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders congratulations with student name and registration number', () => {
    render(
      <PmbAcceptedCelebration
        uuid="reg-uuid"
        studentName="Samuel"
        registrationNumber="PMB-2026-001"
      />,
    )

    expect(screen.getByTestId('pmb-accepted-celebration')).toBeInTheDocument()
    expect(screen.getByText(/Selamat! Samuel diterima/)).toBeInTheDocument()
    expect(screen.getByText('PMB-2026-001')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lihat Surat Penerimaan' })).toBeInTheDocument()
  })
})
