import Image from '@tiptap/extension-image'
import {
  mergeAttributes,
  ResizableNodeView,
  type NodeViewRenderer,
  type NodeViewRendererProps,
  type ResizableNodeViewDirection,
} from '@tiptap/core'
import type { NodeView as ProseMirrorNodeView } from '@tiptap/pm/view'
import {
  createMediaDeleteButton,
  createMediaDragHandle,
  deleteNodeAtPosition,
  isMediaControlEvent,
} from '@/components/editor/mediaNodeControls'

export type ImageAlign = 'left' | 'center' | 'right'

const IMAGE_HTML_ATTRIBUTES = {
  class: 'rounded-lg max-w-full',
}

function syncImageAlign(container: HTMLElement, align: ImageAlign) {
  container.dataset.align = align
}

const RESIZE_HANDLE_DIRECTIONS: ResizableNodeViewDirection[] = [
  'bottom-right',
  'bottom-left',
  'top-right',
  'top-left',
]

const RESIZE_OPTIONS = {
  enabled: true,
  directions: RESIZE_HANDLE_DIRECTIONS,
  minWidth: 80,
  minHeight: 80,
  alwaysPreserveAspectRatio: true,
} as const

function isResizeHandleEvent(event: Event) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return false
  return Boolean(target.closest('[data-resize-handle]'))
}

function revealImageContainer(container: HTMLElement) {
  container.style.visibility = ''
  container.style.pointerEvents = ''
}

function wrapResizableNodeView(
  nodeView: ResizableNodeView,
  props: NodeViewRendererProps,
): ProseMirrorNodeView {
  const container = nodeView.dom as HTMLElement
  const { editor, getPos, node } = props
  const image = container.querySelector('img')

  let dragHandle = container.querySelector<HTMLButtonElement>('[data-drag-handle]')
  if (!dragHandle) {
    dragHandle = createMediaDragHandle('Seret untuk memindahkan gambar')
    container.insertBefore(dragHandle, container.firstChild)
  }

  let deleteButton = container.querySelector<HTMLButtonElement>('[data-media-delete]')
  if (!deleteButton) {
    deleteButton = createMediaDeleteButton('Hapus gambar', () => {
      const pos = getPos()
      if (typeof pos !== 'number') return
      deleteNodeAtPosition(editor, pos, node.nodeSize)
    })
    container.appendChild(deleteButton)
  }

  if (image instanceof HTMLImageElement) {
    const align = (node.attrs.align as ImageAlign | undefined) ?? 'left'
    syncImageAlign(container, align)
    image.dataset.align = align

    if (image.complete) {
      revealImageContainer(container)
    } else {
      image.addEventListener('load', () => revealImageContainer(container), { once: true })
      image.addEventListener('error', () => revealImageContainer(container), { once: true })
    }
  }

  const baseUpdate = nodeView.update.bind(nodeView)

  return {
    dom: container,
    update: (updatedNode) => {
      const result = baseUpdate(updatedNode)
      if (result) {
        const align = (updatedNode.attrs.align as ImageAlign | undefined) ?? 'left'
        syncImageAlign(container, align)
        const img = container.querySelector('img')
        if (img) img.dataset.align = align
      }
      return result
    },
    destroy: nodeView.destroy.bind(nodeView),
    stopEvent(event: Event) {
      return isResizeHandleEvent(event) || isMediaControlEvent(event)
    },
    selectNode() {
      container.classList.add('ProseMirror-selectednode')
      container.draggable = true
      dragHandle?.classList.add('is-visible')
      deleteButton?.classList.add('is-visible')
    },
    deselectNode() {
      container.classList.remove('ProseMirror-selectednode')
      container.removeAttribute('draggable')
      dragHandle?.classList.remove('is-visible')
      deleteButton?.classList.remove('is-visible')
    },
  }
}

function createResizableImageNodeView(
  props: NodeViewRendererProps,
  options: {
    htmlAttributes: Record<string, string>
    resize: {
      directions?: ResizableNodeViewDirection[]
      minWidth?: number
      minHeight?: number
      alwaysPreserveAspectRatio?: boolean
    }
    name: string
  },
): ProseMirrorNodeView | null {
  const { node, getPos, HTMLAttributes, editor } = props
  const directions = options.resize.directions ?? RESIZE_HANDLE_DIRECTIONS
  const minWidth = options.resize.minWidth ?? 80
  const minHeight = options.resize.minHeight ?? 80
  const alwaysPreserveAspectRatio = options.resize.alwaysPreserveAspectRatio ?? true

  const el = document.createElement('img')
  el.draggable = false

  const mergedAttributes = mergeAttributes(options.htmlAttributes, HTMLAttributes)

  Object.entries(mergedAttributes).forEach(([key, value]) => {
    if (value == null) return
    if (key === 'width' || key === 'height') return
    el.setAttribute(key, value)
  })

  if (mergedAttributes.src != null) {
    el.src = String(mergedAttributes.src)
  }

  const nodeView = new ResizableNodeView({
    element: el,
    editor,
    node,
    getPos,
    onResize: (width, height) => {
      el.style.width = `${width}px`
      el.style.height = `${height}px`
    },
    onCommit: (width, height) => {
      const pos = getPos()
      if (pos === undefined) return

      editor
        .chain()
        .setNodeSelection(pos)
        .updateAttributes(options.name, { width, height })
        .run()
    },
    onUpdate: (updatedNode) => updatedNode.type === node.type,
    options: {
      directions,
      min: { width: minWidth, height: minHeight },
      preserveAspectRatio: alwaysPreserveAspectRatio,
    },
  })

  const container = nodeView.dom as HTMLElement
  container.style.visibility = 'hidden'
  container.style.pointerEvents = 'none'

  return wrapResizableNodeView(nodeView, props)
}

const DraggableResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'left' as ImageAlign,
        parseHTML: (element) => {
          const align = element.getAttribute('data-align')
          if (align === 'center' || align === 'right' || align === 'left') {
            return align
          }
          return 'left'
        },
        renderHTML: (attributes) => {
          if (!attributes.align || attributes.align === 'left') {
            return {}
          }
          return { 'data-align': attributes.align }
        },
      },
    }
  },

  addNodeView() {
    const parentAddNodeView = this.parent as (() => NodeViewRenderer | null) | null | undefined

    if (typeof this.options.resize !== 'object' || !this.options.resize.enabled || typeof document === 'undefined') {
      return parentAddNodeView?.() ?? null
    }

    const resize = this.options.resize
    const htmlAttributes = this.options.HTMLAttributes
    const name = this.name

    const renderer = ((props: NodeViewRendererProps) =>
      createResizableImageNodeView(props, {
        htmlAttributes,
        resize,
        name,
      })) as NodeViewRenderer

    return renderer
  },
})

export function createImageExtension(resizable: boolean) {
  return DraggableResizableImage.configure({
    inline: false,
    allowBase64: false,
    HTMLAttributes: IMAGE_HTML_ATTRIBUTES,
    resize: resizable ? RESIZE_OPTIONS : false,
  })
}
