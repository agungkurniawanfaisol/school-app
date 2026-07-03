import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'
import { Columns, Column } from '@/components/editor/extensions/columnsBlock'
import { createFormatExtensions } from '@/components/editor/extensions/formatExtensions'
import { createImageExtension } from '@/components/editor/extensions/resizableImage'
import { VideoBlock } from '@/components/editor/extensions/videoBlock'

function createBaseExtensions(resizableImages: boolean) {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: { openOnClick: false },
    }),
    ...createFormatExtensions(),
    createImageExtension(resizableImages),
    Placeholder.configure({ placeholder: 'Mulai menulis konten…' }),
    Youtube.configure({
      width: 640,
      height: 360,
      HTMLAttributes: { class: 'aspect-video w-full rounded-lg' },
    }),
    VideoBlock,
    Column,
    Columns,
  ]
}

export function createEditorExtensions(uploadImage?: (file: File) => Promise<string>) {
  return [
    ...createBaseExtensions(true),
    ...(uploadImage ? [] : []),
  ]
}

export function createRendererExtensions() {
  return createBaseExtensions(false)
}

export const rendererExtensions = createRendererExtensions()
