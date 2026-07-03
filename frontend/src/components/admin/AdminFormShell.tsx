import type { ReactNode } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminFormShellProps {
  title: string
  description?: string
  backHref: string
  backLabel?: string
  children: ReactNode
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
  isDisabled?: boolean
  footerExtra?: ReactNode
  className?: string
}

export function AdminFormShell({
  title,
  description,
  backHref,
  backLabel = 'Kembali',
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Simpan',
  isSubmitting,
  isDisabled,
  footerExtra,
  className,
}: AdminFormShellProps) {
  return (
    <div className={cn('admin-page admin-fade-in', className)}>
      <div className="mb-6 space-y-3">
        <Button asChild variant="ghost" size="sm" className="gap-2 px-0 hover:bg-transparent">
          <Link to={backHref}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {backLabel}
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>

      <div className="space-y-6">{children}</div>

      {(onSubmit || onCancel) && (
        <div className="admin-form-footer mt-8">
          {footerExtra}
          <div className="ml-auto flex flex-wrap gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Batal
              </Button>
            )}
            {onSubmit && (
              <Button type="button" onClick={onSubmit} disabled={isSubmitting || isDisabled}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {submitLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
