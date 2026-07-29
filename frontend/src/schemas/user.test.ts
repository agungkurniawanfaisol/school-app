import { describe, expect, it } from 'vitest'
import { createCreateUserSchema, userRoleSchema } from '@/schemas/user'

describe('userRoleSchema', () => {
  it('accepts all assignable roles', () => {
    expect(userRoleSchema.parse('admin')).toBe('admin')
    expect(userRoleSchema.parse('guru')).toBe('guru')
    expect(userRoleSchema.parse('admin_pmb')).toBe('admin_pmb')
    expect(userRoleSchema.parse('pendaftar')).toBe('pendaftar')
  })

  it('rejects unknown roles', () => {
    expect(userRoleSchema.safeParse('editor').success).toBe(false)
  })
})

describe('createCreateUserSchema', () => {
  it('accepts pendaftar and admin_pmb on create', () => {
    const schema = createCreateUserSchema((key) => key)

    for (const role of ['admin_pmb', 'pendaftar'] as const) {
      const result = schema.safeParse({
        name: 'User Test',
        email: `${role}@test.id`,
        password: 'password123',
        password_confirmation: 'password123',
        role,
        is_active: true,
      })
      expect(result.success).toBe(true)
    }
  })
})
