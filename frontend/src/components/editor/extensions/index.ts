import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'
import { Columns, Column } from '@/components/editor/extensions/columnsBlock'
import { VideoBlock } from '@/components/editor/extensions/videoBlock'

export function createEditorExtensions(uploadImage?: (file: File) => Promise<string>) {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    Link.configure({ openOnClick: false }),
    Image.configure({ inline: false, allowBase64: false }),
    Placeholder.configure({ placeholder: 'Mulai menulis konten…' }),
    Youtube.configure({
      width: 640,
      height: 360,
      HTMLAttributes: { class: 'aspect-video w-full rounded-lg' },
    }),
    VideoBlock,
    Column,
    Columns,
    ...(uploadImage
      ? []
      : []),
  ]
}

export const rendererExtensions = createEditorExtensions()
