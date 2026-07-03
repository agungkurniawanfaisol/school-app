import type { Editor } from '@tiptap/react'
import { useRef, useState } from 'react'
import {
  Bold,
  Columns2,
  Heading2,
  ImageIcon,
  Link2,
  List,
  ListOrdered,
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
  onClick,
  children,
  label,
}: {
  active?: boolean
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
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </Button>
  )
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

  const handleYoutube = () => {
    const url = youtubeUrl.trim()
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return
    }
    onInsertYoutube(url)
    setYoutubeUrl('')
    setYoutubeOpen(false)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarButton
          label="Tebal"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Judul"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
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
          label="Tautan"
          active={editor.isActive('link')}
          onClick={() => {
            const url = window.prompt('URL tautan')
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
          }}
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
