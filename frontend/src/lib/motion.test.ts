import { describe, expect, it } from 'vitest'
import { springGentle, springSnappy, viewportInView } from '@/lib/motion'

describe('motion presets', () => {
  it('defines snappy spring with stiffness and damping', () => {
    expect(springSnappy).toMatchObject({
      type: 'spring',
      stiffness: 400,
      damping: 32,
    })
  })

  it('defines gentle spring with stiffness and damping', () => {
    expect(springGentle).toMatchObject({
      type: 'spring',
      stiffness: 280,
      damping: 30,
    })
  })

  it('defines repeatable viewport for scroll reveals', () => {
    expect(viewportInView.once).toBe(false)
    expect(viewportInView.amount).toBe(0.2)
  })
})
