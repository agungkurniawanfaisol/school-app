import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { GripVertical, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { resolveAssetUrl } from '@/lib/safe-url'
import type { ActivityPhotoFormValues } from '@/schemas/activity'

interface ActivityPhotoGalleryEditorProps {
  photos: ActivityPhotoFormValues[]
  onChange: (photos: ActivityPhotoFormValues[]) => void
}

function photoSrc(path: string) {
  return resolveAssetUrl(path.startsWith('http') || path.startsWith('/') ? path : `/storage/${path}`, '')
}

export function ActivityPhotoGalleryEditor({ photos, onChange }: ActivityPhotoGalleryEditorProps) {
  const { t } = useTranslation('admin')
  const upload = useMediaUpload('activities')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return

    const remaining = Math.max(0, 24 - photos.length)
    if (remaining === 0) return

    const uploaded: ActivityPhotoFormValues[] = []

    for (const file of Array.from(files).slice(0, remaining)) {
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

  const updatePhoto = (index: number, patch: Partial<ActivityPhotoFormValues>) => {
    onChange(photos.map((photo, i) => (i === index ? { ...photo, ...patch } : photo)))
  }

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index).map((photo, i) => ({ ...photo, order: i })))
  }

  return (
    <Card className="border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div>
          <CardTitle className="text-base">{t('components.activityGallery.title')}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{t('components.activityGallery.desc')}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 shrink-0"
          disabled={upload.isPending || photos.length >= 24}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden />
          )}
          {t('components.activityGallery.addPhoto')}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          aria-label={t('components.activityGallery.uploadAria')}
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
            {t('components.activityGallery.clickToUpload')}
          </button>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.map((photo, index) => (
              <div
                key={`${photo.id ?? photo.path}-${index}`}
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
                    aria-label={t('components.activityGallery.removePhotoAria', { n: index + 1 })}
                    onClick={() => removePhoto(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 p-3">
                  <Label htmlFor={`activity-photo-caption-${index}`} className="text-xs">
                    {t('components.activityGallery.captionLabel')}
                  </Label>
                  <Input
                    id={`activity-photo-caption-${index}`}
                    value={photo.caption ?? ''}
                    onChange={(e) => updatePhoto(index, { caption: e.target.value || null })}
                    placeholder={t('form.photoCaptionPlaceholder')}
                    className="h-10"
                    maxLength={250}
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
