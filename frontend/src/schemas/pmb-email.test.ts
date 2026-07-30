import { describe, expect, it } from 'vitest'
import { pmbEmailBroadcastSchema, pmbEmailSendSchema } from '@/schemas/pmb-email'

describe('pmbEmailSendSchema', () => {
  it('requires subject and body', () => {
    const result = pmbEmailSendSchema.safeParse({
      registration_uuids: ['9a63c44e-aa8e-4e1b-b2c5-cf59ad94f534'],
      subject: '',
      body: '',
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid payload', () => {
    const result = pmbEmailSendSchema.safeParse({
      registration_uuids: ['9a63c44e-aa8e-4e1b-b2c5-cf59ad94f534'],
      subject: 'Pengumuman',
      body: 'Halo {student_name}',
    })

    expect(result.success).toBe(true)
  })
})

describe('pmbEmailBroadcastSchema', () => {
  it('rejects empty subject', () => {
    const result = pmbEmailBroadcastSchema.safeParse({
      status: 'accepted',
      subject: '   ',
      body: 'Isi pesan',
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid broadcast payload', () => {
    const result = pmbEmailBroadcastSchema.safeParse({
      status: 'all',
      subject: 'Info PMB',
      body: 'Selamat pagi.',
    })

    expect(result.success).toBe(true)
  })
})
