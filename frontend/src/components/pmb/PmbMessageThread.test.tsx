import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PmbMessageThread } from '@/components/pmb/PmbMessageThread'
import type { PmbMessage } from '@/types'

const messages: PmbMessage[] = [
  {
    id: 1,
    body: 'Mohon lengkapi KK.',
    user: { id: 2, name: 'Admin PMB', role: 'admin_pmb' },
    created_at: '2026-07-29T10:00:00Z',
  },
  {
    id: 2,
    body: 'Baik, sudah saya unggah.',
    user: { id: 3, name: 'Samuel', role: 'pendaftar' },
    created_at: '2026-07-29T10:05:00Z',
  },
]

describe('PmbMessageThread', () => {
  it('aligns own messages to the right for pendaftar viewer', () => {
    render(<PmbMessageThread messages={messages} viewer="pendaftar" />)

    expect(screen.getByTestId('pmb-message-other')).toHaveAttribute('data-side', 'other')
    expect(screen.getByTestId('pmb-message-own')).toHaveAttribute('data-side', 'own')
    expect(screen.getByText('Mohon lengkapi KK.')).toBeInTheDocument()
    expect(screen.getByText('Baik, sudah saya unggah.')).toBeInTheDocument()
    expect(screen.getByText(/Admin PMB/)).toBeInTheDocument()
  })

  it('aligns admin messages to the right for admin viewer', () => {
    render(<PmbMessageThread messages={messages} viewer="admin" />)

    const own = screen.getByTestId('pmb-message-own')
    const other = screen.getByTestId('pmb-message-other')
    expect(own).toHaveClass('justify-end')
    expect(other).toHaveClass('justify-start')
    expect(own.textContent).toContain('Mohon lengkapi KK.')
    expect(other.textContent).toContain('Baik, sudah saya unggah.')
  })
})
