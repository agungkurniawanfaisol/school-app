import { describe, expect, it } from 'vitest'
import { getAcademicYear } from '@/lib/academic-year'

describe('academic-year', () => {
  it('formats school year correctly', () => {
    expect(getAcademicYear(new Date('2026-07-28'))).toBe('2026/2027')
  })
})
