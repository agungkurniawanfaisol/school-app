import { Node, mergeAttributes } from '@tiptap/core'

export const Column = Node.create({
  name: 'column',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-column]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-column': 'true', class: 'space-y-4' }), 0]
  },
})

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column column',
  defining: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-columns]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-columns': 'true',
        class: 'grid gap-6 md:grid-cols-2',
      }),
      0,
    ]
  },
})
