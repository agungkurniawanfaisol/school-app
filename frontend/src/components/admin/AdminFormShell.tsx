import type { ReactNode } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  isLoading?: boolean
  actions?: ReactNode
  footerExtra?: ReactNode
  className?: string
}

export function AdminFormShell({
  title,
  description,
  backHref,
  backLabel,
  children,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting,
  isDisabled,
  isLoading,
  actions,
  footerExtra,
  className,
}: AdminFormShellProps) {
  const { t } = useTranslation('admin')
  const resolvedBackLabel = backLabel ?? t('common.back')
  const resolvedSubmitLabel = submitLabel ?? t('common.save')

  if (isLoading) {
    return (
      <div className={cn('admin-page admin-fade-in', className)}>
        <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>
      </div>
    )
  }

  return (
    <div className={cn('admin-page admin-fade-in', className)}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="min-h-11 gap-2 px-0 hover:bg-transparent">
            <Link to={backHref}>
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {resolvedBackLabel}
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {actions}
      </div>

      <div className="space-y-6 pb-20 sm:pb-10">{children}</div>

      {(onSubmit || onCancel) && (
        <div className="admin-form-footer mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {footerExtra}
          <div className="ml-auto flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="min-h-11 w-full sm:w-auto"
              >
                {t('common.cancel')}
              </Button>
            )}
            {onSubmit && (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting || isDisabled}
                className="min-h-11 w-full sm:w-auto"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {resolvedSubmitLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
