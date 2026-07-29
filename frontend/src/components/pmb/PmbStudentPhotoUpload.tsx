import { useEffect, useId, useRef, useState } from 'react'
import { Camera, CheckCircle2, ImagePlus, Loader2, RefreshCw } from 'lucide-react'
import type { UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UploadProgressBar, uploadStatusLabel } from '@/components/common/UploadProgressBar'
import { Button } from '@/components/ui/button'
import type { UploadPhase } from '@/hooks/useMediaUpload'
import { resolveAssetUrl } from '@/lib/safe-url'
import { ALLOWED_UPLOAD_IMAGE_TYPES } from '@/lib/uploadValidation'
import { PMB_STUDENT_PHOTO_HINT } from '@/lib/pmb-upload-limits'
import { cn } from '@/lib/utils'
import type { Media } from '@/types'

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp'

type PmbPortalUploadPurpose = 'student_photo' | 'payment_proof' | 'testimonial_photo'

type PmbStudentPhotoUploadProps = {
  studentName: string
  mediaId?: number
  previewUrl?: string | null
  upload: UseMutationResult<Media, Error, { file: File; purpose: PmbPortalUploadPurpose }, unknown> & {
    progress: number
    phase: UploadPhase
  }
  onUploaded: (media: Media) => void
}

export function PmbStudentPhotoUpload({
  studentName,
  mediaId,
  previewUrl,
  upload,
  onUploaded,
}: PmbStudentPhotoUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview)
      }
    }
  }, [localPreview])

  const resolvedPreview = localPreview || (previewUrl ? resolveAssetUrl(previewUrl, '') : '')
  const hasPhoto = Boolean(resolvedPreview) && !imageError
  const isUploading = upload.isPending
  const isSaved = Boolean(mediaId) && hasPhoto && !isUploading
  useEffect(() => {
    setImageError(false)
  }, [resolvedPreview])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!(ALLOWED_UPLOAD_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      toast.error('Format foto harus JPG, PNG, atau WebP.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)

    upload.mutate(
      { file, purpose: 'student_photo' },
      {
        onSuccess: (media) => {
          onUploaded(media)
        },
        onError: () => {
          setLocalPreview(null)
        },
      },
    )
  }

  const openPicker = () => inputRef.current?.click()
  const statusLabel = uploadStatusLabel(upload.phase, upload.progress)

  return (
    <div
      data-form-field="student_photo_media_id"
      className="overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-b from-primary/[0.06] to-background shadow-sm"
    >
      <div className="border-b border-primary/10 px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-foreground">Foto Siswa *</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Pas foto wajah terlihat jelas. {PMB_STUDENT_PHOTO_HINT}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 px-4 py-5 sm:px-5 sm:py-6">
        <div className="relative">
          <label
            htmlFor={inputId}
            className={cn(
              'group relative flex size-32 touch-manipulation cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 bg-muted/30 shadow-inner transition-all motion-reduce:transition-none sm:size-36',
              hasPhoto ? 'border-primary/30' : 'border-dashed border-primary/25 hover:border-primary/45 hover:bg-primary/5 active:border-primary/50 active:bg-primary/10',
              isUploading && 'pointer-events-none',
            )}
          >
            {hasPhoto ? (
              <img
                src={resolvedPreview}
                alt={studentName ? `Foto ${studentName}` : 'Foto calon siswa'}
                className="size-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 px-3 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="size-7" aria-hidden />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Ketuk untuk unggah</span>
              </div>
            )}

            {hasPhoto && !isUploading && (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-0">
                <Camera className="size-6" aria-hidden />
                <span className="text-xs font-semibold">Ganti foto</span>
              </span>
            )}

            {isUploading && (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-[2px]">
                <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
                <span className="text-xs font-medium text-muted-foreground">{statusLabel}</span>
              </span>
            )}
          </label>

          {isSaved && (
            <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-primary/20 bg-background px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm">
              <CheckCircle2 className="size-3.5" aria-hidden />
              Tersimpan
            </span>
          )}
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="sr-only"
          onChange={handleChange}
          disabled={isUploading}
        />

        <div className="flex w-full max-w-xs flex-col gap-2">
          {isUploading && (
            <UploadProgressBar phase={upload.phase} progress={upload.progress} compact />
          )}
          <Button
            type="button"
            variant={hasPhoto ? 'default' : 'outline'}
            className={cn(
              'h-11 w-full gap-2 touch-manipulation font-semibold shadow-sm active:scale-[0.98] motion-reduce:active:scale-100',
              hasPhoto && 'bg-primary hover:bg-primary/90',
            )}
            onClick={openPicker}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {statusLabel}
              </>
            ) : hasPhoto ? (
              <>
                <RefreshCw className="size-4" aria-hidden />
                Ganti Foto
              </>
            ) : (
              <>
                <Camera className="size-4" aria-hidden />
                Unggah Foto
              </>
            )}
          </Button>

          {hasPhoto && !isUploading && (
            <p className="text-center text-xs text-muted-foreground">
              Ketuk foto atau tombol di atas untuk mengganti
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
