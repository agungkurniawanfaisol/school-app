import { describe, expect, it } from 'vitest'
import { createImageExtension } from '@/components/editor/extensions/resizableImage'

describe('createImageExtension', () => {
  it('enables resize handles in editor mode', () => {
    const ext = createImageExtension(true)
    expect(ext.options.resize).toMatchObject({
      enabled: true,
      minWidth: 80,
      minHeight: 80,
      alwaysPreserveAspectRatio: true,
    })
  })

  it('disables resize in renderer mode', () => {
    const ext = createImageExtension(false)
    expect(ext.options.resize).toBe(false)
  })

  it('defines align attribute with left default', () => {
    const ext = createImageExtension(true)
    const align = ext.config.addAttributes?.().align
    expect(align?.default).toBe('left')
    expect(align?.renderHTML?.({ align: 'center' })).toEqual({ 'data-align': 'center' })
    expect(align?.renderHTML?.({ align: 'left' })).toEqual({})
    expect(align?.parseHTML?.({ getAttribute: () => 'right' } as never)).toBe('right')
  })
})
