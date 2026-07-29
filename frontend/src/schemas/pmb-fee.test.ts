import { describe, expect, it } from 'vitest'
import { formatRupiah, parseRupiahInput, pmbFeeFormSchema } from '@/schemas/pmb-fee'

describe('pmb-fee schema helpers', () => {
  it('formats and parses rupiah', () => {
    expect(formatRupiah(350000)).toBe('Rp 350.000')
    expect(parseRupiahInput('Rp 350.000')).toBe(350000)
    expect(parseRupiahInput('')).toBeNull()
  })

  it('validates form values', () => {
    expect(
      pmbFeeFormSchema.safeParse({
        school_id: 1,
        academic_year_id: 2,
        amount: 350000,
        is_active: true,
      }).success,
    ).toBe(true)

    expect(
      pmbFeeFormSchema.safeParse({
        school_id: 1,
        academic_year_id: 2,
        amount: 500,
      }).success,
    ).toBe(false)
  })
})
