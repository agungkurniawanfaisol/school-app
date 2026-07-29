import { useQueryClient } from '@tanstack/react-query'
import { Download, Loader2, Printer, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { downloadPmbRegistrationsCsv, pmbKeys } from '@/hooks/usePmb'
import { getApiErrorMessage } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { ListFilters } from '@/types'

interface PmbExportActionsProps {
  filters: ListFilters
  isRefreshing?: boolean
}

export function PmbExportActions({ filters, isRefreshing = false }: PmbExportActionsProps) {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const [exporting, setExporting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: pmbKeys.adminLists() }),
        queryClient.invalidateQueries({ queryKey: [...pmbKeys.all, 'admin', 'stats'] }),
      ])
      toast.success(t('pages.pmb.refreshSuccess'))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('pages.pmb.refreshError')))
    } finally {
      setRefreshing(false)
    }
  }

  const handleCsv = async () => {
    setExporting(true)
    try {
      await downloadPmbRegistrationsCsv(filters)
      toast.success(t('pages.pmb.export.csvSuccess'))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('pages.pmb.export.csvError')))
    } finally {
      setExporting(false)
    }
  }

  const busy = refreshing || isRefreshing

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row print:hidden" data-testid="pmb-export-actions">
      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full cursor-pointer sm:w-auto"
        disabled={busy}
        aria-busy={busy}
        aria-label={t('common.refresh')}
        onClick={() => void handleRefresh()}
      >
        <RefreshCw className={cn('h-4 w-4', busy && 'animate-spin')} aria-hidden />
        {t('common.refresh')}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full cursor-pointer sm:w-auto"
        onClick={handlePrint}
        aria-label={t('pages.pmb.export.print')}
      >
        <Printer className="h-4 w-4" aria-hidden />
        {t('pages.pmb.export.print')}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full cursor-pointer border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 sm:w-auto"
        disabled={exporting}
        aria-busy={exporting}
        aria-label={t('pages.pmb.export.csv')}
        onClick={() => void handleCsv()}
      >
        {exporting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
        {exporting ? t('pages.pmb.export.downloading') : t('pages.pmb.export.csv')}
      </Button>
    </div>
  )
}
