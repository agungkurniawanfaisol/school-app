import { CheckCircle2, FileText, Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UploadProgressBar } from '@/components/common/UploadProgressBar'
import type { UploadPhase } from '@/hooks/useMediaUpload'
import { cn } from '@/lib/utils'

interface PmbFileUploadZoneProps {
  accept?: string
  label?: string
  replaceLabel?: string
  hint?: string
  isUploading?: boolean
  uploadPhase?: UploadPhase
  uploadProgress?: number
  uploaded?: boolean
  fileName?: string | null
  previewUrl?: string | null
  onFileSelect: (file: File) => void
  className?: string
}

export function PmbFileUploadZone({
  accept = 'image/*,.pdf',
  label = 'Unggah file',
  replaceLabel = 'Ganti file',
  hint = 'JPG, PNG, WEBP, atau PDF. Maks. 10 MB.',
  isUploading = false,
  uploadPhase = 'idle',
  uploadProgress = 0,
  uploaded = false,
  fileName,
  previewUrl,
  onFileSelect,
  className,
}: PmbFileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview)
      }
    }
  }, [localPreview])

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setLocalPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return url
        })
      } else {
        setLocalPreview(null)
      }
      onFileSelect(file)
    },
    [onFileSelect],
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragging(false)
      const file = event.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const resolvedPreview = previewUrl || localPreview
  const showImagePreview = Boolean(
    resolvedPreview &&
      (resolvedPreview.startsWith('blob:') ||
        resolvedPreview.startsWith('http') ||
        resolvedPreview.startsWith('/')),
  )
  const phase = isUploading ? uploadPhase : 'idle'

  return (
    <div className={cn('space-y-2', className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        aria-busy={isUploading}
        className={cn(
          'relative flex min-h-[9rem] touch-manipulation cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-4 transition-[border-color,background-color,transform] duration-150 motion-reduce:transition-none',
          'active:scale-[0.99] motion-reduce:active:scale-100',
          isDragging && 'border-primary bg-primary/10',
          uploaded && !isUploading && 'border-primary/40 bg-primary/5',
          !isDragging &&
            !uploaded &&
            'border-primary/20 bg-muted/20 hover:border-primary/35 hover:bg-primary/5 active:border-primary/45 active:bg-primary/10',
          isUploading && 'pointer-events-none opacity-70',
        )}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) handleFile(file)
          }}
          disabled={isUploading}
        />

        {showImagePreview && resolvedPreview ? (
          <img
            src={resolvedPreview}
            alt="Pratinjau unggahan"
            className="max-h-28 max-w-full rounded-md object-contain"
          />
        ) : uploaded && fileName ? (
          <FileText className="h-10 w-10 text-primary" aria-hidden />
        ) : (
          <Upload className="h-10 w-10 text-primary/60" aria-hidden />
        )}

        <div className="w-full text-center">
          {isUploading ? (
            <UploadProgressBar phase={phase} progress={uploadProgress} className="mx-auto max-w-xs text-left" />
          ) : uploaded ? (
            <div className="space-y-1">
              <p className="flex items-center justify-center gap-1.5 break-all text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                {fileName ? fileName : 'File sudah terunggah'}
              </p>
              <p className="text-xs text-muted-foreground">{replaceLabel} — ketuk untuk pilih file baru</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
              <p className="mt-1.5 text-xs text-muted-foreground sm:hidden">Ketuk untuk memilih file</p>
              <p className="mt-1.5 hidden text-xs text-muted-foreground sm:block">Klik atau seret file ke sini</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
