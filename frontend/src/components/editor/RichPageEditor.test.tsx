import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Editor } from '@tiptap/react'
import { EMPTY_EDITOR_DOC } from '@/schemas/editor'

const useEditorMock = vi.fn()

vi.mock('@tiptap/react', () => ({
  useEditor: (options: unknown) => useEditorMock(options),
  EditorContent: () => <div data-testid="editor-content" />,
}))

vi.mock('@/components/editor/EditorToolbar', () => ({
  EditorToolbar: () => <div data-testid="toolbar" />,
}))

vi.mock('@/components/editor/MediaBubbleMenu', () => ({
  MediaBubbleMenu: () => null,
}))

vi.mock('@/hooks/useMediaUpload', () => ({
  useMediaUpload: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

function renderEditor(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('RichPageEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('passes immediatelyRender: false to useEditor', async () => {
    useEditorMock.mockReturnValue(null)
    const { RichPageEditor } = await import('@/components/editor/RichPageEditor')

    renderEditor(<RichPageEditor value={EMPTY_EDITOR_DOC} />)

    expect(useEditorMock).toHaveBeenCalledWith(
      expect.objectContaining({ immediatelyRender: false }),
    )
  })

  it('does not crash when syncing content on a destroyed editor', async () => {
    const destroyed = {
      isDestroyed: true,
      getJSON: vi.fn(() => {
        throw new Error('should not call getJSON on destroyed editor')
      }),
      commands: {
        setContent: vi.fn(() => {
          throw new Error('should not call setContent on destroyed editor')
        }),
      },
    } as unknown as Editor

    useEditorMock.mockReturnValue(destroyed)
    const { RichPageEditor } = await import('@/components/editor/RichPageEditor')

    expect(() =>
      renderEditor(<RichPageEditor value={EMPTY_EDITOR_DOC} onChange={vi.fn()} />),
    ).not.toThrow()

    await waitFor(() => {
      expect(screen.queryByTestId('toolbar')).not.toBeInTheDocument()
    })
  })

  it('renders toolbar when editor is ready', async () => {
    const ready = {
      isDestroyed: false,
      getJSON: vi.fn(() => EMPTY_EDITOR_DOC),
      getHTML: vi.fn(() => '<p></p>'),
      commands: { setContent: vi.fn() },
      chain: vi.fn(),
    } as unknown as Editor

    useEditorMock.mockReturnValue(ready)
    const { RichPageEditor } = await import('@/components/editor/RichPageEditor')

    renderEditor(<RichPageEditor value={EMPTY_EDITOR_DOC} />)

    expect(await screen.findByTestId('toolbar')).toBeInTheDocument()
  })
})
