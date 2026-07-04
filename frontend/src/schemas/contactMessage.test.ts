import { describe, expect, it } from 'vitest'
import { contactMessageSchema } from './contactMessage'

describe('contactMessageSchema', () => {
  it('accepts valid contact message input', () => {
    const result = contactMessageSchema.safeParse({
      school_id: 1,
      name: 'Ahmad Fauzi',
      email: 'ahmad@example.com',
      phone: '08123456789',
      subject: 'Pertanyaan tentang pendaftaran',
      message: 'Saya ingin menanyakan tentang jadwal pendaftaran siswa baru.',
    })
    expect(result.success).toBe(true)
  })

  it('accepts input without optional phone', () => {
    const result = contactMessageSchema.safeParse({
      school_id: 1,
      name: 'Siti Aisyah',
      email: 'siti@example.com',
      subject: 'Info Kurikulum',
      message: 'Mohon informasi mengenai kurikulum yang digunakan.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = contactMessageSchema.safeParse({
      school_id: 1,
      name: 'Test User',
      email: 'not-an-email',
      subject: 'Test',
      message: 'Test message content.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path[0] === 'email')
      expect(emailError).toBeDefined()
      expect(emailError?.message).toBe('Email tidak valid')
    }
  })

  it('rejects empty name', () => {
    const result = contactMessageSchema.safeParse({
      school_id: 1,
      name: '',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty subject', () => {
    const result = contactMessageSchema.safeParse({
      school_id: 1,
      name: 'Test',
      email: 'test@example.com',
      subject: '',
      message: 'Test message.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty message', () => {
    const result = contactMessageSchema.safeParse({
      school_id: 1,
      name: 'Test',
      email: 'test@example.com',
      subject: 'Test',
      message: '',
    })
    expect(result.success).toBe(false)
  })
})
