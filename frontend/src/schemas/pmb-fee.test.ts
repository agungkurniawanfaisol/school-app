import { describe, expect, it } from 'vitest'
import { defaultFeeName, pmbFeeFormSchema } from '@/schemas/pmb-fee'

describe('pmbFeeFormSchema', () => {
  it('accepts a complete multi-program fee', () => {
    const result = pmbFeeFormSchema.safeParse({
      school_id: 1,
      academic_year_id: 2,
      name: 'SD ICP',
      jenjang: 'sd',
      program: 'icp',
      amount: 450000,
      bank_name: 'BSI',
      account_number: '123',
      account_holder: 'Yayasan',
      is_active: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing bank fields', () => {
    const result = pmbFeeFormSchema.safeParse({
      school_id: 1,
      academic_year_id: 2,
      name: 'SD Reguler',
      jenjang: 'sd',
      program: 'reguler',
      amount: 350000,
      bank_name: '',
      account_number: '',
      account_holder: '',
    })
    expect(result.success).toBe(false)
  })

  it('builds default fee name', () => {
    expect(defaultFeeName('tk', 'reguler')).toBe('TK Reguler')
    expect(defaultFeeName('sd', 'icp')).toBe('SD ICP')
  })
})
