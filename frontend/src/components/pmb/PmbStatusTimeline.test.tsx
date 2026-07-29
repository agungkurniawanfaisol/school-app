import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PmbStatusTimeline } from '@/components/pmb/PmbStatusTimeline'

describe('PmbStatusTimeline', () => {
  it('highlights current pipeline stage', () => {
    render(
      <PmbStatusTimeline
        status="awaiting_verification"
        events={[{ id: 1, type: 'submitted', message: 'Pendaftaran dikirim', created_at: '2026-07-28T10:00:00Z' }]}
      />,
    )

    expect(screen.getByText('Proses pendaftaran')).toBeInTheDocument()
    expect(screen.getByText('Menunggu verifikasi')).toBeInTheDocument()
    expect(
      screen.getByText(/Admin memeriksa data dan bukti pembayaran/i),
    ).toBeInTheDocument()
    expect(screen.getByText('Pendaftaran dikirim')).toBeInTheDocument()
  })

  it('shows rejected terminal state', () => {
    render(<PmbStatusTimeline status="rejected" events={[]} compact />)
    expect(screen.getByText('Ditolak')).toBeInTheDocument()
  })
})
