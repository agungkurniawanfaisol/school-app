import { useRef } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { cn } from '@/lib/utils'

interface AdminImageFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  collection?: 'news' | 'activities' | 'facilities' | 'teachers' | 'general'
  className?: string
  hint?: string
}

export function AdminImageField({
  label,
  value,
  onChange,
  collection = 'general',
  className,
  hint,
}: AdminImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useMediaUpload(collection)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const result = await upload.mutateAsync(file)
    onChange(result.url)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start lg:flex-col lg:items-stretch">
        {value ? (
          <div className="relative mx-auto h-32 w-full max-w-full shrink-0 overflow-hidden rounded-lg border border-primary/10 bg-muted sm:mx-0 sm:h-28 sm:max-w-xs sm:w-48">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() => onChange('')}
              aria-label="Hapus gambar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
            className="mx-auto flex h-32 w-full max-w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/25 bg-muted/50 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted sm:mx-0 sm:h-28 sm:max-w-xs sm:w-48"
          >
            {upload.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
            Unggah gambar
          </button>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <Input
            placeholder="atau tempel URL gambar"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
          >
            Pilih file
          </Button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          void handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
