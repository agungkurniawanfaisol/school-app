import { describe, expect, it } from 'vitest'
import { editorDocumentSchema, EMPTY_EDITOR_DOC, parseEditorDocument } from './editor'

describe('editorDocumentSchema', () => {
  it('accepts minimal doc', () => {
    const result = editorDocumentSchema.safeParse(EMPTY_EDITOR_DOC)
    expect(result.success).toBe(true)
  })

  it('parseEditorDocument returns fallback for invalid input', () => {
    expect(parseEditorDocument(null)).toEqual(EMPTY_EDITOR_DOC)
  })
})
