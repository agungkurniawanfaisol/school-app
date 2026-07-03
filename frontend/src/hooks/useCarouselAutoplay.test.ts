import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useCarouselAutoplayPlugins } from '@/hooks/useCarouselAutoplay'

const usePrefersReducedMotionMock = vi.fn(() => false)

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => usePrefersReducedMotionMock(),
}))

vi.mock('embla-carousel-autoplay', () => ({
  default: vi.fn((options: unknown) => ({ name: 'autoplay', options })),
}))

describe('useCarouselAutoplayPlugins', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePrefersReducedMotionMock.mockReturnValue(false)
  })

  it('returns empty plugins for single slide', () => {
    const { result } = renderHook(() => useCarouselAutoplayPlugins(1))
    expect(result.current).toEqual([])
  })

  it('returns autoplay plugin for multiple slides', () => {
    const { result } = renderHook(() => useCarouselAutoplayPlugins(3))
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({ name: 'autoplay' })
  })

  it('disables autoplay when user prefers reduced motion', () => {
    usePrefersReducedMotionMock.mockReturnValue(true)
    const { result } = renderHook(() => useCarouselAutoplayPlugins(3))
    expect(result.current).toEqual([])
  })
})
