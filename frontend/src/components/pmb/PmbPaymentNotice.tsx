import { Copy, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PmbPaymentNoticeProps {
  fee?: string | null
  bankName?: string | null
  accountNumber?: string | null
  accountHolder?: string | null
  registrationNumber?: string | null
  studentName?: string | null
}

async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} disalin.`)
  } catch {
    toast.error(`Gagal menyalin ${label}.`)
  }
}

function DetailRow({
  label,
  value,
  mono = false,
  copyAriaLabel,
  copyToastLabel,
}: {
  label: string
  value: string
  mono?: boolean
  copyAriaLabel?: string
  copyToastLabel?: string
}) {
  return (
    <li className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5 sm:justify-end">
        <strong className={cn('break-all text-sm sm:text-right', mono && 'font-mono')}>{value}</strong>
        {copyAriaLabel && copyToastLabel && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 text-primary"
            aria-label={copyAriaLabel}
            onClick={() => void copyText(value, copyToastLabel)}
          >
            <Copy className="size-4" aria-hidden />
          </Button>
        )}
      </span>
    </li>
  )
}

export function PmbPaymentNotice({
  fee,
  bankName,
  accountNumber,
  accountHolder,
  registrationNumber,
  studentName,
}: PmbPaymentNoticeProps) {
  const transferReference = registrationNumber
    ? `No. Registrasi (${registrationNumber})`
    : studentName
      ? `nama calon siswa (${studentName})`
      : 'nama calon siswa'

  return (
    <Alert className="border-primary/25 bg-primary/5">
      <CreditCard className="h-5 w-5 text-primary" />
      <AlertTitle className="text-primary">Instruksi Transfer</AlertTitle>
      <AlertDescription className="space-y-3 text-sm leading-relaxed">
        <p>
          Lakukan transfer sesuai nominal biaya pendaftaran. Cantumkan{' '}
          <strong className="break-words">{transferReference}</strong> pada berita transfer, lalu unggah bukti
          pembayaran di bawah.
        </p>
        <ul className="space-y-3 rounded-lg border border-primary/15 bg-background/60 p-3 sm:space-y-2">
          {fee && <DetailRow label="Biaya pendaftaran" value={fee} />}
          {bankName && <DetailRow label="Bank" value={bankName} />}
          {accountNumber && (
            <DetailRow
              label="No. Rekening"
              value={accountNumber}
              mono
              copyAriaLabel="Salin nomor rekening"
              copyToastLabel="Nomor rekening"
            />
          )}
          {accountHolder && <DetailRow label="Atas nama" value={accountHolder} />}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
