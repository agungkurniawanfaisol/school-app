import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbEmailDialog } from '@/components/admin/pmb/PmbEmailDialog'

describe('PmbEmailDialog', () => {
  it('disables send button when subject or body is empty', () => {
    render(
      <PmbEmailDialog
        mode="send"
        open
        onOpenChange={vi.fn()}
        registrationUuids={['9a63c44e-aa8e-4e1b-b2c5-cf59ad94f534']}
        onSend={vi.fn()}
        onBroadcast={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /Kirim email/i })).toBeDisabled()
  })

  it('calls onBroadcast with valid payload', () => {
    const onBroadcast = vi.fn()

    render(
      <PmbEmailDialog
        mode="broadcast"
        open
        onOpenChange={vi.fn()}
        onSend={vi.fn()}
        onBroadcast={onBroadcast}
      />,
    )

    fireEvent.change(screen.getByLabelText(/Subjek/i), { target: { value: 'Info PMB' } })
    fireEvent.change(screen.getByLabelText(/Isi pesan/i), { target: { value: 'Selamat pagi.' } })
    fireEvent.click(screen.getByRole('button', { name: /Kirim email/i }))

    expect(onBroadcast).toHaveBeenCalledWith({
      status: 'all',
      subject: 'Info PMB',
      body: 'Selamat pagi.',
    })
  })
})
