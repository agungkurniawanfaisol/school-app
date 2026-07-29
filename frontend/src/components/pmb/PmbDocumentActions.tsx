import { Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { printPmbDocument, type PmbPrintKind } from '@/lib/pmb-print'
import { cn } from '@/lib/utils'

interface PmbDocumentActionsProps {
  kind: PmbPrintKind
  className?: string
  printLabel?: string
  pdfLabel?: string
}

export function PmbDocumentActions({
  kind,
  className,
  printLabel = 'Cetak',
  pdfLabel = 'Simpan PDF',
}: PmbDocumentActionsProps) {
  return (
    <div className={cn('flex flex-col gap-2 print:hidden sm:flex-row', className)}>
      <Button
        type="button"
        variant="outline"
        className="h-11 min-h-11 gap-2 touch-manipulation"
        onClick={() => printPmbDocument(kind)}
      >
        <Printer className="h-4 w-4" aria-hidden />
        {printLabel}
      </Button>
      <Button
        type="button"
        className="h-11 min-h-11 gap-2 touch-manipulation"
        onClick={() => printPmbDocument(kind)}
      >
        <Download className="h-4 w-4" aria-hidden />
        {pdfLabel}
      </Button>
    </div>
  )
}
