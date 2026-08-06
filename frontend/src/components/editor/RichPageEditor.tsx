import { useCallback, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import type { JSONContent } from '@tiptap/core'
import { toast } from 'sonner'
import { createEditorExtensions } from '@/components/editor/extensions'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { MediaBubbleMenu } from '@/components/editor/MediaBubbleMenu'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { getApiErrorMessage } from '@/lib/api'
import { focusEditor } from '@/lib/tiptap-focus'
import { isAllowedImageFile } from '@/lib/uploadValidation'
import { EMPTY_EDITOR_DOC, parseEditorDocument, type EditorDocument } from '@/schemas/editor'

function collectImageFiles(dataTransfer: DataTransfer | null) {
  if (!dataTransfer?.files?.length) return []
  return Array.from(dataTransfer.files).filter((file) => isAllowedImageFile(file))
}

function stableDocKey(doc: unknown): string {
  return JSON.stringify(parseEditorDocument(doc))
}

async function insertImagesAtPosition(
  editor: Editor,
  uploadImage: (file: File) => Promise<string>,
  pos: number,
  files: File[],
) {
  const nodes = []
  for (const file of files) {
    const url = await uploadImage(file)
    nodes.push({ type: 'image', attrs: { src: url } })
  }
  if (nodes.length > 0) {
    focusEditor(editor).insertContentAt(pos, nodes).run()
  }
}

interface RichPageEditorProps {
  value?: EditorDocument | Record<string, unknown> | null
  onChange?: (json: EditorDocument, html: string) => void
  collection?: 'news' | 'activities' | 'facilities' | 'teachers' | 'general'
  className?: string
}

export function RichPageEditor({
  value,
  onChange,
  collection = 'general',
  className,
}: RichPageEditorProps) {
  const upload = useMediaUpload(collection)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const uploadImageRef = useRef<(file: File) => Promise<string>>(async () => '')
  const editorRef = useRef<Editor | null>(null)
  /** Last document key emitted by this editor — skip echo setContent that jumps the caret. */
  const lastEmittedKeyRef = useRef<string | null>(null)

  const handleImageUpload = useCallback(
    async (file: File) => {
      const media = await upload.mutateAsync(file)
      return media.url
    },
    [upload],
  )

  uploadImageRef.current = handleImageUpload

  const editor = useEditor({
    // TipTap + React 19: avoid creating the editor during the first render pass
    // (Strict Mode / Suspense remounts otherwise call commands on a destroyed instance).
    immediatelyRender: false,
    extensions: createEditorExtensions(),
    content: (value ? parseEditorDocument(value) : EMPTY_EDITOR_DOC) as JSONContent,
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none min-h-[320px] px-4 py-3 focus:outline-none dark:prose-invert',
      },
      handleDOMEvents: {
        dragover: (_view, event) => {
          if (collectImageFiles(event.dataTransfer).length > 0) {
            event.preventDefault()
            return true
          }
          return false
        },
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false

        const imageFiles = collectImageFiles(event.dataTransfer)
        if (!imageFiles.length) return false

        event.preventDefault()
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
        const pos = coords?.pos ?? view.state.selection.from
        const activeEditor = editorRef.current
        if (!activeEditor || activeEditor.isDestroyed) return false

        void insertImagesAtPosition(activeEditor, uploadImageRef.current, pos, imageFiles).catch(
          (error) => {
            toast.error(getApiErrorMessage(error, 'Gagal mengunggah gambar.'))
          },
        )

        return true
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items
        if (!items) return false

        const imageFiles = Array.from(items)
          .map((item) => (item.type.startsWith('image/') ? item.getAsFile() : null))
          .filter((file): file is File => file !== null && isAllowedImageFile(file))

        if (!imageFiles.length) return false

        event.preventDefault()
        const activeEditor = editorRef.current
        if (!activeEditor || activeEditor.isDestroyed) return false

        const pos = activeEditor.state.selection.from
        void insertImagesAtPosition(activeEditor, uploadImageRef.current, pos, imageFiles).catch(
          (error) => {
            toast.error(getApiErrorMessage(error, 'Gagal mengunggah gambar.'))
          },
        )

        return true
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (ed.isDestroyed) return
      const json = ed.getJSON() as EditorDocument
      lastEmittedKeyRef.current = stableDocKey(json)
      onChangeRef.current?.(json, ed.getHTML())
    },
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  useEffect(() => {
    if (!editor || editor.isDestroyed || value === undefined) return

    const nextKey = stableDocKey(value)
    if (lastEmittedKeyRef.current === nextKey) return
    if (stableDocKey(editor.getJSON()) === nextKey) {
      lastEmittedKeyRef.current = nextKey
      return
    }

    // External update only (e.g. loaded from API) — do not emit onUpdate / scroll.
    editor.commands.setContent(parseEditorDocument(value) as JSONContent, { emitUpdate: false })
    lastEmittedKeyRef.current = nextKey
  }, [editor, value])

  const insertImage = async (file: File) => {
    if (!editor || editor.isDestroyed) return
    try {
      const url = await handleImageUpload(file)
      focusEditor(editor).setImage({ src: url }).run()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Gagal mengunggah gambar.'))
    }
  }

  const insertVideo = async (file: File) => {
    if (!editor || editor.isDestroyed) return
    try {
      const media = await upload.mutateAsync(file)
      focusEditor(editor).insertContent({ type: 'videoBlock', attrs: { src: media.url } }).run()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Gagal mengunggah video.'))
    }
  }

  const insertYoutube = (url: string) => {
    if (!editor || editor.isDestroyed) return
    focusEditor(editor).setYoutubeVideo({ src: url }).run()
  }

  const insertColumns = () => {
    if (!editor || editor.isDestroyed) return
    focusEditor(editor)
      .insertContent({
        type: 'columns',
        content: [
          { type: 'column', content: [{ type: 'paragraph' }] },
          { type: 'column', content: [{ type: 'paragraph' }] },
        ],
      })
      .run()
  }

  if (!editor || editor.isDestroyed) {
    return <div className="min-h-[320px] animate-pulse rounded-lg border bg-muted/30" />
  }

  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-primary/15 bg-card ${className ?? ''}`}>
      <div className="order-2 border-t bg-muted/30 p-2 md:order-1 md:border-b md:border-t-0">
        <EditorToolbar
          editor={editor}
          onInsertImage={insertImage}
          onInsertVideo={insertVideo}
          onInsertYoutube={insertYoutube}
          onInsertColumns={insertColumns}
          isUploading={upload.isPending}
        />
      </div>
      <div className="order-1 md:order-2">
        <EditorContent editor={editor} className="tiptap-editor" />
        <MediaBubbleMenu editor={editor} />
        <p className="border-t border-primary/10 bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
          Klik gambar/video untuk memilih. Gunakan ikon hapus atau tombol Hapus, atau tekan{' '}
          <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">Delete</kbd>.
          Gambar bisa di-resize (sudut) dan dipindah (grip). Jatuhkan file gambar ke editor untuk mengunggah.
        </p>
      </div>
    </div>
  )
}
