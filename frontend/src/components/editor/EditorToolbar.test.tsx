import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EditorToolbar } from '@/components/editor/EditorToolbar'

function createMockEditor() {
  const run = vi.fn()
  const chain = () => ({
    focus: () => ({
      undo: () => ({ run }),
      redo: () => ({ run }),
      toggleBold: () => ({ run }),
      setTextAlign: (align: string) => {
        expect(['left', 'center', 'right', 'justify']).toContain(align)
        return { run }
      },
      toggleItalic: () => ({ run }),
      toggleUnderline: () => ({ run }),
      toggleStrike: () => ({ run }),
      toggleCode: () => ({ run }),
      toggleHeading: () => ({ run }),
      toggleBulletList: () => ({ run }),
      toggleOrderedList: () => ({ run }),
      toggleBlockquote: () => ({ run }),
      setHorizontalRule: () => ({ run }),
      toggleSubscript: () => ({ run }),
      toggleSuperscript: () => ({ run }),
      setColor: () => ({ run }),
      unsetColor: () => ({ run }),
      extendMarkRange: () => ({
        setLink: () => ({ run }),
        unsetLink: () => ({ run }),
      }),
    }),
  })

  return {
    editor: {
      chain,
      can: () => ({ undo: () => false, redo: () => false }),
      isActive: vi.fn(() => false),
      getAttributes: vi.fn(() => ({})),
    },
    run,
  }
}

describe('EditorToolbar', () => {
  const noop = vi.fn()

  it('renders full formatting toolbar groups', () => {
    const { editor } = createMockEditor()

    render(
      <EditorToolbar
        editor={editor as never}
        onInsertImage={noop}
        onInsertVideo={noop}
        onInsertYoutube={noop}
        onInsertColumns={noop}
      />,
    )

    expect(screen.getByLabelText('Urungkan')).toBeDisabled()
    expect(screen.getByLabelText('Ulangi')).toBeDisabled()
    expect(screen.getByLabelText('Tebal')).toBeInTheDocument()
    expect(screen.getByLabelText('Miring')).toBeInTheDocument()
    expect(screen.getByLabelText('Garis bawah')).toBeInTheDocument()
    expect(screen.getByLabelText('Coret')).toBeInTheDocument()
    expect(screen.getByLabelText('Kode')).toBeInTheDocument()
    expect(screen.getByLabelText('Judul 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Judul 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Rata kanan-kiri')).toBeInTheDocument()
    expect(screen.getByLabelText('Kutipan')).toBeInTheDocument()
    expect(screen.getByLabelText('Garis pemisah')).toBeInTheDocument()
    expect(screen.getByLabelText('Subscript')).toBeInTheDocument()
    expect(screen.getByLabelText('Superscript')).toBeInTheDocument()
    expect(screen.getByLabelText('Warna teks')).toBeInTheDocument()
    expect(screen.getByLabelText('Tautan')).toBeInTheDocument()
    expect(screen.getByLabelText('Gambar')).toBeInTheDocument()
  })

  it('toggles bold on click', () => {
    const { editor, run } = createMockEditor()

    render(
      <EditorToolbar
        editor={editor as never}
        onInsertImage={noop}
        onInsertVideo={noop}
        onInsertYoutube={noop}
        onInsertColumns={noop}
      />,
    )

    fireEvent.click(screen.getByLabelText('Tebal'))
    expect(run).toHaveBeenCalled()
  })

  it('opens link dialog', () => {
    const { editor } = createMockEditor()

    render(
      <EditorToolbar
        editor={editor as never}
        onInsertImage={noop}
        onInsertVideo={noop}
        onInsertYoutube={noop}
        onInsertColumns={noop}
      />,
    )

    fireEvent.click(screen.getByLabelText('Tautan'))
    expect(screen.getByRole('heading', { name: 'Tautan' })).toBeInTheDocument()
  })
})
