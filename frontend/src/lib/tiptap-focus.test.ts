import { describe, expect, it, vi } from 'vitest'
import { focusEditor } from '@/lib/tiptap-focus'
import type { Editor } from '@tiptap/react'

describe('focusEditor', () => {
  it('focuses without scrollIntoView', () => {
    const focus = vi.fn(() => ({ run: vi.fn() }))
    const chain = vi.fn(() => ({ focus }))
    const editor = { chain } as unknown as Editor

    focusEditor(editor)

    expect(chain).toHaveBeenCalled()
    expect(focus).toHaveBeenCalledWith(undefined, { scrollIntoView: false })
  })
})
