import { cn } from '@/lib/utils'
import type { UploadPhase } from '@/hooks/useMediaUpload'

interface UploadProgressBarProps {
  phase: UploadPhase
  progress: number
  className?: string
  compact?: boolean
}

export function uploadStatusLabel(phase: UploadPhase, progress: number): string {
  if (phase === 'compressing') return 'Mengompres…'
  if (phase === 'uploading') {
    return progress > 0 ? `Mengunggah… ${progress}%` : 'Mengunggah…'
  }
  return 'Mengunggah…'
}

export function UploadProgressBar({ phase, progress, className, compact = false }: UploadProgressBarProps) {
  if (phase === 'idle') return null

  const value = phase === 'compressing' ? undefined : Math.max(0, Math.min(100, progress))
  const label = uploadStatusLabel(phase, progress)

  return (
    <div className={cn('w-full space-y-1.5', className)} role="status" aria-live="polite">
      <p className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm font-medium')}>{label}</p>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full bg-primary transition-[width] duration-150 motion-reduce:transition-none',
            phase === 'compressing' && 'w-1/3 animate-pulse',
          )}
          style={phase === 'uploading' ? { width: `${value ?? 0}%` } : undefined}
        />
      </div>
    </div>
  )
}
