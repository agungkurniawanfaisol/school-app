import type { Editor } from '@tiptap/react'
import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const TEXT_COLORS = [
  { label: 'Hitam', value: '#171717' },
  { label: 'Abu', value: '#737373' },
  { label: 'Merah', value: '#dc2626' },
  { label: 'Hijau', value: '#15803d' },
  { label: 'Biru', value: '#2563eb' },
] as const

interface EditorColorPickerProps {
  editor: Editor
}

export function EditorColorPicker({ editor }: EditorColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-11 w-11 shrink-0"
          aria-label="Warna teks"
          title="Warna teks"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex flex-wrap gap-1.5">
          {TEXT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              className="h-8 w-8 rounded-md border border-border transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ backgroundColor: color.value }}
              aria-label={color.label}
              title={color.label}
              onClick={() => editor.chain().focus().setColor(color.value).run()}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 h-8 w-full text-xs"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Hapus warna
        </Button>
      </PopoverContent>
    </Popover>
  )
}
