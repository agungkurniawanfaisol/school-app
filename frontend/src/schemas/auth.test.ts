import { describe, expect, it } from 'vitest'
import { loginSchema } from './auth'

describe('loginSchema', () => {
  it('accepts valid login input', () => {
    const result = loginSchema.safeParse({
      email: 'admin@sekolah.id',
      password: 'rahasia123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'bukan-email',
      password: 'rahasia123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined()
    }
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'admin@sekolah.id',
      password: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined()
    }
  })
})
