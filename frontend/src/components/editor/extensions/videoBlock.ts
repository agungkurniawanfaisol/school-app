import { Node, mergeAttributes } from '@tiptap/core'
import {
  createMediaDeleteButton,
  createMediaDragHandle,
  deleteNodeAtPosition,
  isMediaControlEvent,
} from '@/components/editor/mediaNodeControls'

export const VideoBlock = Node.create({
  name: 'videoBlock',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

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

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div')
      container.dataset.mediaWrapper = 'video'
      container.contentEditable = 'false'

      const dragHandle = createMediaDragHandle('Seret untuk memindahkan video')
      const deleteButton = createMediaDeleteButton('Hapus video', () => {
        const pos = getPos()
        if (typeof pos !== 'number') return
        deleteNodeAtPosition(editor, pos, node.nodeSize)
      })

      const video = document.createElement('video')
      video.controls = true
      video.className = 'w-full rounded-lg'
      video.dataset.videoBlock = 'true'
      if (node.attrs.src) video.src = node.attrs.src
      if (node.attrs.poster) video.poster = node.attrs.poster

      container.appendChild(dragHandle)
      container.appendChild(deleteButton)
      container.appendChild(video)

      return {
        dom: container,
        update(updatedNode) {
          if (updatedNode.type.name !== 'videoBlock') return false
          if (updatedNode.attrs.src) video.src = updatedNode.attrs.src
          else video.removeAttribute('src')
          if (updatedNode.attrs.poster) video.poster = updatedNode.attrs.poster
          else video.removeAttribute('poster')
          return true
        },
        stopEvent(event: Event) {
          return isMediaControlEvent(event)
        },
        selectNode() {
          container.classList.add('ProseMirror-selectednode')
          container.draggable = true
          dragHandle.classList.add('is-visible')
          deleteButton.classList.add('is-visible')
        },
        deselectNode() {
          container.classList.remove('ProseMirror-selectednode')
          container.removeAttribute('draggable')
          dragHandle.classList.remove('is-visible')
          deleteButton.classList.remove('is-visible')
        },
      }
    }
  },
})
