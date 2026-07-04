import { generateHTML } from '@tiptap/html'
import type { JSONContent } from '@tiptap/core'
import { rendererExtensions } from '@/components/editor/extensions'
import { sanitizeRichHtml } from '@/lib/sanitizeRichHtml'
import { EMPTY_EDITOR_DOC, parseEditorDocument } from '@/schemas/editor'
import type { EditorDocument } from '@/schemas/editor'

interface BlockRendererProps {
  contentJson?: EditorDocument | Record<string, unknown> | null
  contentHtml?: string | null
  className?: string
}

function resolveHtml(
  contentJson?: EditorDocument | Record<string, unknown> | null,
  contentHtml?: string | null,
): string {
  if (contentJson) {
    const doc = parseEditorDocument(contentJson)
    if (doc.content?.length) {
      try {
        return generateHTML(doc as JSONContent, rendererExtensions)
      } catch {
        // fall through to contentHtml
      }
    }
  }

  if (contentHtml?.trim()) {
    return contentHtml
  }

  return ''
}

export function BlockRenderer({ contentJson, contentHtml, className }: BlockRendererProps) {
  const rawHtml = resolveHtml(contentJson, contentHtml)
  if (!rawHtml) {
    return <p className="text-muted-foreground">Konten belum tersedia.</p>
  }

  const html = sanitizeRichHtml(rawHtml)
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
