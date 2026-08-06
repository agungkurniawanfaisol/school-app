import type { Editor } from '@tiptap/react'

/** Focus the editor without scrolling the page (avoids TipTap jumpiness). */
export function focusEditor(editor: Editor) {
  return editor.chain().focus(undefined, { scrollIntoView: false })
}
