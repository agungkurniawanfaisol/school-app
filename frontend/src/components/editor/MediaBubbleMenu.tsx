import type { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { AlignCenter, AlignLeft, AlignRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  deleteSelectedMedia,
  getImageAlign,
  isImageNodeActive,
  isMediaNodeActive,
  setImageAlign,
  type ImageAlign,
} from '@/components/editor/mediaNodeControls'

interface MediaBubbleMenuProps {
  editor: Editor
}

function AlignButton({
  align,
  current,
  label,
  onClick,
  children,
}: {
  align: ImageAlign
  current: ImageAlign
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant={current === align ? 'default' : 'ghost'}
      className="h-9 w-9"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export function MediaBubbleMenu({ editor }: MediaBubbleMenuProps) {
  const imageActive = isImageNodeActive(editor)
  const imageAlign = imageActive ? getImageAlign(editor) : 'left'

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed }) => isMediaNodeActive(ed)}
      className="flex items-center gap-1 rounded-lg border border-primary/15 bg-card p-1 shadow-md"
    >
      {imageActive && (
        <>
          <AlignButton
            align="left"
            current={imageAlign}
            label="Rata kiri"
            onClick={() => setImageAlign(editor, 'left')}
          >
            <AlignLeft className="h-4 w-4" aria-hidden />
          </AlignButton>
          <AlignButton
            align="center"
            current={imageAlign}
            label="Rata tengah"
            onClick={() => setImageAlign(editor, 'center')}
          >
            <AlignCenter className="h-4 w-4" aria-hidden />
          </AlignButton>
          <AlignButton
            align="right"
            current={imageAlign}
            label="Rata kanan"
            onClick={() => setImageAlign(editor, 'right')}
          >
            <AlignRight className="h-4 w-4" aria-hidden />
          </AlignButton>
          <span className="mx-0.5 h-6 w-px bg-border" aria-hidden />
        </>
      )}
      <Button
        type="button"
        size="sm"
        variant="destructive"
        className="h-9 gap-1.5 px-3"
        onClick={() => deleteSelectedMedia(editor)}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        Hapus
      </Button>
    </BubbleMenu>
  )
}
