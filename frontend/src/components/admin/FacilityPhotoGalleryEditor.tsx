import { useRef } from 'react'
import { GripVertical, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import type { FacilityPhotoFormValues } from '@/schemas/facility'

interface FacilityPhotoGalleryEditorProps {
  photos: FacilityPhotoFormValues[]
  onChange: (photos: FacilityPhotoFormValues[]) => void
}

function photoSrc(path: string) {
  if (path.startsWith('http') || path.startsWith('/')) return path
  return `/storage/${path}`
}

export function FacilityPhotoGalleryEditor({ photos, onChange }: FacilityPhotoGalleryEditorProps) {
  const upload = useMediaUpload('facilities')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return

    const uploaded: FacilityPhotoFormValues[] = []

    for (const file of Array.from(files)) {
      const media = await upload.mutateAsync(file)
      uploaded.push({
        path: media.url,
        caption: null,
        order: photos.length + uploaded.length,
        is_active: true,
      })
    }

    onChange([...photos, ...uploaded])
    if (inputRef.current) inputRef.current.value = ''
  }

  const updatePhoto = (index: number, patch: Partial<FacilityPhotoFormValues>) => {
    onChange(photos.map((photo, i) => (i === index ? { ...photo, ...patch } : photo)))
  }

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index).map((photo, i) => ({ ...photo, order: i })))
  }

  return (
    <Card className="border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div>
          <CardTitle className="text-base">Galeri Foto</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Unggah lebih dari satu foto untuk fasilitas ini.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 shrink-0"
          disabled={upload.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden />
          )}
          Tambah Foto
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          aria-label="Unggah foto fasilitas"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </CardHeader>

      <CardContent className="space-y-3">
        {photos.length === 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/20 bg-muted/30 p-6 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50"
          >
            <ImagePlus className="h-8 w-8 opacity-50" aria-hidden />
            Klik untuk mengunggah foto galeri
          </button>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.map((photo, index) => (
              <div
                key={`${photo.path}-${index}`}
                className="overflow-hidden rounded-xl border border-primary/10 bg-card"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <img
                    src={photoSrc(photo.path)}
                    alt={photo.caption ?? `Foto ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-background/80 text-muted-foreground">
                    <GripVertical className="h-4 w-4" aria-hidden />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-9 w-9"
                    aria-label={`Hapus foto ${index + 1}`}
                    onClick={() => removePhoto(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 p-3">
                  <Label htmlFor={`photo-caption-${index}`} className="text-xs">
                    Keterangan foto
                  </Label>
                  <Input
                    id={`photo-caption-${index}`}
                    value={photo.caption ?? ''}
                    onChange={(e) => updatePhoto(index, { caption: e.target.value || null })}
                    placeholder="Contoh: Ruang kelas"
                    className="h-10"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
