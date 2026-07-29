import { describe, expect, it } from 'vitest'
import { formatCapitalizeFirst, formatTitleCaseWords } from '@/lib/text-format'

describe('formatTitleCaseWords', () => {
  it('capitalizes first letter of each word', () => {
    expect(formatTitleCaseWords('ahmad fauzi')).toBe('Ahmad Fauzi')
    expect(formatTitleCaseWords('budi santoso')).toBe('Budi Santoso')
  })

  it('preserves multiple spaces between words', () => {
    expect(formatTitleCaseWords('ahmad  fauzi')).toBe('Ahmad  Fauzi')
  })

  it('handles single character', () => {
    expect(formatTitleCaseWords('a')).toBe('A')
  })
})

describe('formatCapitalizeFirst', () => {
  it('capitalizes only the first character', () => {
    expect(formatCapitalizeFirst('jl. merdeka no 5')).toBe('Jl. merdeka no 5')
  })

  it('preserves leading whitespace', () => {
    expect(formatCapitalizeFirst('  alamat')).toBe('  Alamat')
  })
})
