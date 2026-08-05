import { describe, expect, it } from 'vitest'
import { gmailTestSendSchema } from '@/schemas/gmail-test'

describe('gmailTestSendSchema', () => {
  it('accepts valid payload', () => {
    const result = gmailTestSendSchema.safeParse({
      to: 'uji@example.com',
      subject: 'Tes',
      body: 'Halo',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = gmailTestSendSchema.safeParse({
      to: 'bukan-email',
      subject: 'Tes',
      body: 'Halo',
    })
    expect(result.success).toBe(false)
  })
})
