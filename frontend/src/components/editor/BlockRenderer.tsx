import { generateHTML } from '@tiptap/html'
import type { JSONContent } from '@tiptap/core'
import { rendererExtensions } from '@/components/editor/extensions'
import { EMPTY_EDITOR_DOC, parseEditorDocument } from '@/schemas/editor'
import type { EditorDocument } from '@/schemas/editor'

interface BlockRendererProps {
  contentJson?: EditorDocument | Record<string, unknown> | null
  contentHtml?: string | null
  className?: string
}

export function BlockRenderer({ contentJson, contentHtml, className }: BlockRendererProps) {
  if (!contentJson && !contentHtml) {
    return <p className="text-muted-foreground">Konten belum tersedia.</p>
  }

  const doc = contentJson ? parseEditorDocument(contentJson) : EMPTY_EDITOR_DOC

  let html = contentHtml ?? ''
  if (!html && doc.content?.length) {
    try {
      html = generateHTML(doc as JSONContent, rendererExtensions)
    } catch {
      html = ''
    }
  }

  if (!html) {
    return <p className="text-muted-foreground">Konten belum tersedia.</p>
  }

  return (
    <article
      className={`prose prose-neutral max-w-none dark:prose-invert ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
