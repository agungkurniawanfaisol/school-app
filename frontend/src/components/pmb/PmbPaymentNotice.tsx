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
  muted = false,
  copyAriaLabel,
  copyToastLabel,
}: {
  label: string
  value: string
  mono?: boolean
  muted?: boolean
  copyAriaLabel?: string
  copyToastLabel?: string
}) {
  return (
    <li className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5 sm:justify-end">
        <strong
          className={cn(
            'break-all text-sm sm:text-right',
            mono && 'font-mono',
            muted && 'font-normal text-muted-foreground',
          )}
        >
          {value}
        </strong>
        {!muted && copyAriaLabel && copyToastLabel && (
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

function displayOrMissing(value?: string | null): { text: string; missing: boolean } {
  const trimmed = value?.trim() ?? ''
  if (!trimmed) {
    return { text: 'Belum dikonfigurasi — hubungi admin sekolah', missing: true }
  }
  return { text: trimmed, missing: false }
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

  const bank = displayOrMissing(bankName)
  const account = displayOrMissing(accountNumber)
  const holder = displayOrMissing(accountHolder)
  const bankIncomplete = bank.missing || account.missing || holder.missing

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
        {bankIncomplete && (
          <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-900 dark:text-amber-100">
            Rekening tujuan belum lengkap. Minta admin mengisi Bank, No. Rekening, dan Atas nama di Pengaturan PMB.
          </p>
        )}
        <ul className="space-y-3 rounded-lg border border-primary/15 bg-background/60 p-3 sm:space-y-2">
          {fee && <DetailRow label="Biaya pendaftaran" value={fee} />}
          <DetailRow label="Bank" value={bank.text} muted={bank.missing} />
          <DetailRow
            label="No. Rekening"
            value={account.text}
            mono={!account.missing}
            muted={account.missing}
            copyAriaLabel="Salin nomor rekening"
            copyToastLabel="Nomor rekening"
          />
          <DetailRow label="Atas nama" value={holder.text} muted={holder.missing} />
        </ul>
      </AlertDescription>
    </Alert>
  )
}
