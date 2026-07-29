import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { PmbDocumentBarcode } from '@/components/pmb/pmb-document-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PmbRegistrationIdentityCardProps {
  uuid?: string | null
  registrationNumber?: string | null
  /** Registration number is shown only after submit (not while draft). */
  showRegistrationNumber?: boolean
  /** UUID is shown only after registration is submitted (not while draft). */
  showUuid?: boolean
}

async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} disalin.`)
  } catch {
    toast.error(`Gagal menyalin ${label}.`)
  }
}

export function PmbRegistrationIdentityCard({
  uuid,
  registrationNumber,
  showRegistrationNumber = false,
  showUuid = false,
}: PmbRegistrationIdentityCardProps) {
  const showNumber = Boolean(showRegistrationNumber && registrationNumber)
  const showUuidBlock = Boolean(showUuid && uuid)
  if (!showNumber && !showUuidBlock) return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Identitas Pendaftaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {showNumber && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-muted-foreground">No. Registrasi</p>
              <p className="break-all font-mono font-semibold">{registrationNumber}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              aria-label="Salin nomor registrasi"
              onClick={() => {
                if (!registrationNumber) return
                void copyText(registrationNumber, 'Nomor registrasi')
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {showUuid && uuid && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground">UUID</p>
              <p className="break-all font-mono text-xs">{uuid}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              aria-label="Salin UUID"
              onClick={() => void copyText(uuid, 'UUID')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {showNumber && registrationNumber && <PmbDocumentBarcode value={registrationNumber} size={120} />}
      </CardContent>
    </Card>
  )
}
