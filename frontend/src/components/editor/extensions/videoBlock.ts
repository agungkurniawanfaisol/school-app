import { Node, mergeAttributes } from '@tiptap/core'

export const VideoBlock = Node.create({
  name: 'videoBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      poster: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'video[data-video-block]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(HTMLAttributes, {
        'data-video-block': 'true',
        controls: 'true',
        class: 'w-full rounded-lg',
      }),
    ]
  },
})
