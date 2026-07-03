import { useCallback, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import type { JSONContent } from '@tiptap/core'
import { createEditorExtensions } from '@/components/editor/extensions'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { EMPTY_EDITOR_DOC, parseEditorDocument, type EditorDocument } from '@/schemas/editor'

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

  const handleImageUpload = useCallback(
    async (file: File) => {
      const media = await upload.mutateAsync(file)
      return media.url
    },
    [upload],
  )

  const editor = useEditor({
    extensions: createEditorExtensions(),
    content: (value ? parseEditorDocument(value) : EMPTY_EDITOR_DOC) as JSONContent,
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none min-h-[320px] px-4 py-3 focus:outline-none dark:prose-invert',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChangeRef.current?.(ed.getJSON() as EditorDocument, ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor || value === undefined) return
    const current = JSON.stringify(editor.getJSON())
    const next = JSON.stringify(parseEditorDocument(value))
    if (current !== next) {
      editor.commands.setContent(parseEditorDocument(value) as JSONContent)
    }
  }, [editor, value])

  const insertImage = async (file: File) => {
    if (!editor) return
    const url = await handleImageUpload(file)
    editor.chain().focus().setImage({ src: url }).run()
  }

  const insertVideo = async (file: File) => {
    if (!editor) return
    const media = await upload.mutateAsync(file)
    editor.chain().focus().insertContent({ type: 'videoBlock', attrs: { src: media.url } }).run()
  }

  const insertYoutube = (url: string) => {
    editor?.chain().focus().setYoutubeVideo({ src: url }).run()
  }

  const insertColumns = () => {
    editor
      ?.chain()
      .focus()
      .insertContent({
        type: 'columns',
        content: [
          { type: 'column', content: [{ type: 'paragraph' }] },
          { type: 'column', content: [{ type: 'paragraph' }] },
        ],
      })
      .run()
  }

  if (!editor) {
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
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
