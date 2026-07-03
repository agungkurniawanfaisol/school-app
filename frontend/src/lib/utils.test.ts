import { describe, expect, it } from 'vitest'
import { cn, formatCurrency } from './utils'

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})

describe('formatCurrency', () => {
  it('returns Gratis for null', () => {
    expect(formatCurrency(null)).toBe('Gratis')
  })
})
