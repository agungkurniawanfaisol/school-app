import { z } from 'zod'

export const editorNodeSchema: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.unknown()).optional(),
    content: z.array(editorNodeSchema).optional(),
    text: z.string().optional(),
    marks: z
      .array(
        z.object({
          type: z.string(),
          attrs: z.record(z.unknown()).optional(),
        }),
      )
      .optional(),
  }),
)

export const editorDocumentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(editorNodeSchema).optional(),
})

export type EditorDocument = z.infer<typeof editorDocumentSchema>

export const EMPTY_EDITOR_DOC: EditorDocument = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

export function parseEditorDocument(value: unknown): EditorDocument {
  const parsed = editorDocumentSchema.safeParse(value)
  if (parsed.success) {
    return parsed.data
  }
  return EMPTY_EDITOR_DOC
}
