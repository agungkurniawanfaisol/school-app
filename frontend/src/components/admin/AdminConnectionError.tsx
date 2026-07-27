import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface AdminConnectionErrorProps {
  onRetry: () => void
  isRetrying?: boolean
}

export function AdminConnectionError({ onRetry, isRetrying }: AdminConnectionErrorProps) {
  const { t } = useTranslation('admin')

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-primary/15 bg-card p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">{t('errors.connectionTitle')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('errors.connectionDescription')}</p>
        <Button type="button" className="mt-4" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? t('common.connecting') : t('common.retry')}
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">{t('errors.connectionHint')}</p>
      </div>
    </div>
  )
}
