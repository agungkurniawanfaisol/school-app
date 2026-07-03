import type { Editor } from '@tiptap/react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Columns2,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo2,
  Video,
  Youtube,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { EditorColorPicker } from '@/components/editor/EditorColorPicker'
import { EditorLinkDialog } from '@/components/editor/EditorLinkDialog'
import { parseYoutubeEmbedUrl } from '@/lib/editorUrls'

interface EditorToolbarProps {
  editor: Editor
  onInsertImage: (file: File) => Promise<void>
  onInsertVideo: (file: File) => Promise<void>
  onInsertYoutube: (url: string) => void
  onInsertColumns: () => void
  isUploading?: boolean
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
  label,
}: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
  label: string
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant={active ? 'default' : 'ghost'}
      className="h-11 w-11 shrink-0"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  )
}

function ToolbarDivider() {
  return <span className="mx-0.5 hidden h-8 w-px shrink-0 bg-border sm:block" aria-hidden />
}

export function EditorToolbar({
  editor,
  onInsertImage,
  onInsertVideo,
  onInsertYoutube,
  onInsertColumns,
  isUploading,
}: EditorToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [youtubeOpen, setYoutubeOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [linkOpen, setLinkOpen] = useState(false)

  const handleYoutube = () => {
    const parsed = parseYoutubeEmbedUrl(youtubeUrl)
    if (!parsed) {
      toast.error('URL YouTube tidak valid.')
      return
    }
    onInsertYoutube(parsed)
    setYoutubeUrl('')
    setYoutubeOpen(false)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarButton
          label="Urungkan"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Ulangi"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Tebal"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Miring"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Garis bawah"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Coret"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Kode"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Judul 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Judul 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Rata kiri"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Rata tengah"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Rata kanan"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Rata kanan-kiri"
          active={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Daftar"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Daftar bernomor"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Kutipan"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Garis pemisah"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Subscript"
          active={editor.isActive('subscript')}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <Subscript className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Superscript"
          active={editor.isActive('superscript')}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <Superscript className="h-4 w-4" />
        </ToolbarButton>

        <EditorColorPicker editor={editor} />

        <ToolbarDivider />

        <ToolbarButton
          label="Tautan"
          active={editor.isActive('link')}
          onClick={() => setLinkOpen(true)}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Gambar" onClick={() => imageInputRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Video" onClick={() => videoInputRef.current?.click()}>
          <Video className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="YouTube" onClick={() => setYoutubeOpen(true)}>
          <Youtube className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Dua kolom" onClick={onInsertColumns}>
          <Columns2 className="h-4 w-4" />
        </ToolbarButton>

        {isUploading && <span className="px-2 text-xs text-muted-foreground">Mengunggah…</span>}
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) await onInsertImage(file)
          e.target.value = ''
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) await onInsertVideo(file)
          e.target.value = ''
        }}
      />

      <EditorLinkDialog editor={editor} open={linkOpen} onOpenChange={setLinkOpen} />

      <Dialog open={youtubeOpen} onOpenChange={setYoutubeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sisipkan video YouTube</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setYoutubeOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={handleYoutube}>
              Sisipkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
