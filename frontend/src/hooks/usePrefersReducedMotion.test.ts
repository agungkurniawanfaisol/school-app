import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const useReducedMotionMock = vi.fn(() => false)

vi.mock('motion/react', () => ({
  useReducedMotion: () => useReducedMotionMock(),
}))

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

describe('usePrefersReducedMotion', () => {
  beforeEach(() => {
    useReducedMotionMock.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns false when motion is allowed', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when reduced motion is preferred', () => {
    useReducedMotionMock.mockReturnValue(true)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })
})
