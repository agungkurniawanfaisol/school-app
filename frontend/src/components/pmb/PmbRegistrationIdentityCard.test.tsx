import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PmbRegistrationIdentityCard } from '@/components/pmb/PmbRegistrationIdentityCard'

describe('PmbRegistrationIdentityCard', () => {
  it('hides registration number until showRegistrationNumber is true', () => {
    render(
      <PmbRegistrationIdentityCard
        uuid="abc-123-uuid"
        registrationNumber="PMB-2026-001"
      />,
    )

    expect(screen.queryByText('PMB-2026-001')).not.toBeInTheDocument()
    expect(screen.queryByText('Identitas Pendaftaran')).not.toBeInTheDocument()
  })

  it('shows registration number when showRegistrationNumber is true', () => {
    render(
      <PmbRegistrationIdentityCard
        uuid="abc-123-uuid"
        registrationNumber="PMB-2026-001"
        showRegistrationNumber
      />,
    )

    expect(screen.getAllByText('PMB-2026-001').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByTestId('pmb-document-barcode')).toBeInTheDocument()
    expect(screen.queryByText('UUID')).not.toBeInTheDocument()
  })

  it('shows uuid when showUuid is true', () => {
    render(
      <PmbRegistrationIdentityCard
        uuid="abc-123-uuid"
        registrationNumber="PMB-2026-001"
        showUuid
        showRegistrationNumber
      />,
    )

    expect(screen.getByText('UUID')).toBeInTheDocument()
    expect(screen.getByText('abc-123-uuid')).toBeInTheDocument()
  })
})
