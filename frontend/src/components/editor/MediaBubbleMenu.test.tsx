import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MediaBubbleMenu } from '@/components/editor/MediaBubbleMenu'

vi.mock('@tiptap/react/menus', () => ({
  BubbleMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="bubble-menu">{children}</div>,
}))

function createImageEditor(align: 'left' | 'center' | 'right' = 'left') {
  const run = vi.fn()
  return {
    editor: {
      isActive: vi.fn((type: string) => type === 'image'),
      getAttributes: vi.fn(() => ({ align })),
      chain: () => ({
        focus: () => ({
          updateAttributes: (_type: string, attrs: { align: string }) => {
            expect(attrs.align).toBeDefined()
            return { run }
          },
          deleteSelection: () => ({ run }),
        }),
      }),
    },
    run,
  }
}

describe('MediaBubbleMenu', () => {
  it('renders image alignment controls when image is active', () => {
    const { editor } = createImageEditor()

    render(<MediaBubbleMenu editor={editor as never} />)

    expect(screen.getByLabelText('Rata kiri')).toBeInTheDocument()
    expect(screen.getByLabelText('Rata tengah')).toBeInTheDocument()
    expect(screen.getByLabelText('Rata kanan')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hapus' })).toBeInTheDocument()
  })

  it('applies center alignment on click', () => {
    const { editor, run } = createImageEditor()

    render(<MediaBubbleMenu editor={editor as never} />)
    fireEvent.click(screen.getByLabelText('Rata tengah'))

    expect(run).toHaveBeenCalled()
  })
})
