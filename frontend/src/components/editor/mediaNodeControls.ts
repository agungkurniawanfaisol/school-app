import type { Editor } from '@tiptap/react'

const DELETE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`

const GRIP_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>`

export const MEDIA_NODE_TYPES = ['image', 'videoBlock', 'youtube'] as const

export type ImageAlign = 'left' | 'center' | 'right'

export function isImageNodeActive(editor: Editor) {
  return editor.isActive('image')
}

export function setImageAlign(editor: Editor, align: ImageAlign) {
  editor.chain().focus().updateAttributes('image', { align }).run()
}

export function getImageAlign(editor: Editor): ImageAlign {
  const attrs = editor.getAttributes('image')
  const align = attrs.align
  if (align === 'center' || align === 'right') return align
  return 'left'
}

export function isMediaNodeActive(editor: Editor) {
  return MEDIA_NODE_TYPES.some((type) => editor.isActive(type))
}

export function deleteNodeAtPosition(editor: Editor, pos: number, nodeSize: number) {
  editor.chain().focus().deleteRange({ from: pos, to: pos + nodeSize }).run()
}

export function deleteSelectedMedia(editor: Editor) {
  editor.chain().focus().deleteSelection().run()
}

export function isMediaControlEvent(event: Event) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest('[data-resize-handle], [data-drag-handle], [data-media-delete]'),
  )
}

export function createMediaDeleteButton(label: string, onDelete: () => void) {
  const button = document.createElement('button')
  button.type = 'button'
  button.dataset.mediaDelete = ''
  button.contentEditable = 'false'
  button.setAttribute('aria-label', label)
  button.title = label
  button.innerHTML = DELETE_ICON
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    onDelete()
  })
  return button
}

export function createMediaDragHandle(label: string) {
  const button = document.createElement('button')
  button.type = 'button'
  button.dataset.dragHandle = ''
  button.contentEditable = 'false'
  button.setAttribute('aria-label', label)
  button.title = label
  button.innerHTML = GRIP_ICON
  return button
}
