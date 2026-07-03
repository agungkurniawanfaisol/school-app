import type { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { editorLinkSchema } from '@/lib/editorUrls'

interface EditorLinkDialogProps {
  editor: Editor
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditorLinkDialog({ editor, open, onOpenChange }: EditorLinkDialogProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const previous = editor.getAttributes('link').href as string | undefined
    setUrl(previous ?? '')
    setError(null)
  }, [editor, open])

  const handleSave = () => {
    const parsed = editorLinkSchema.safeParse(url)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'URL tidak valid.')
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: parsed.data }).run()
    onOpenChange(false)
  }

  const handleRemove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setUrl('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tautan</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="https://contoh.com"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSave()
            }
          }}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter className="gap-2 sm:gap-0">
          {editor.isActive('link') && (
            <Button type="button" variant="outline" onClick={handleRemove}>
              Hapus tautan
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="button" onClick={handleSave}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
