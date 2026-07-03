import { describe, expect, it, vi } from 'vitest'
import {
  deleteNodeAtPosition,
  getImageAlign,
  isMediaNodeActive,
  setImageAlign,
} from '@/components/editor/mediaNodeControls'

describe('mediaNodeControls', () => {
  it('detects active media nodes', () => {
    const editor = {
      isActive: vi.fn((type: string) => type === 'image'),
    }

    expect(isMediaNodeActive(editor as never)).toBe(true)
  })

  it('deletes node at position', () => {
    const run = vi.fn()
    const editor = {
      chain: () => ({
        focus: () => ({
          deleteRange: ({ from, to }: { from: number; to: number }) => {
            expect(from).toBe(2)
            expect(to).toBe(3)
            return { run }
          },
        }),
      }),
    }

    deleteNodeAtPosition(editor as never, 2, 1)
    expect(run).toHaveBeenCalled()
  })

  it('sets image alignment', () => {
    const run = vi.fn()
    const editor = {
      chain: () => ({
        focus: () => ({
          updateAttributes: (_type: string, attrs: { align: string }) => {
            expect(attrs.align).toBe('center')
            return { run }
          },
        }),
      }),
    }

    setImageAlign(editor as never, 'center')
    expect(run).toHaveBeenCalled()
  })

  it('reads image alignment from attributes', () => {
    const editor = {
      getAttributes: () => ({ align: 'right' }),
    }

    expect(getImageAlign(editor as never)).toBe('right')
  })
})
