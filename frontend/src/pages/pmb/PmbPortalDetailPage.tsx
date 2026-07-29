import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { PmbAcceptedCelebration } from '@/components/pmb/PmbAcceptedCelebration'
import { PmbLoaDocument } from '@/components/pmb/PmbLoaDocument'
import { PmbMessageThread } from '@/components/pmb/PmbMessageThread'
import { PmbRegistrationFormDocument } from '@/components/pmb/PmbRegistrationFormDocument'
import { PmbStatusTimeline } from '@/components/pmb/PmbStatusTimeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { isPmbRegistrationSubmitted, PMB_STATUS_DESCRIPTIONS, PMB_STATUS_LABELS } from '@/config/pmb-portal-nav'
import { usePmbPortalDetail, usePmbPortalMessage } from '@/hooks/usePmb'
import { useSchool } from '@/hooks/useSchool'
import { getAuthToken, getStoredUser } from '@/lib/api'
import { PMB_INPUT_TEXT } from '@/lib/pmb-portal-layout'
import { cn } from '@/lib/utils'

export function PmbPortalDetailPage() {
  const { uuid = '' } = useParams<{ uuid: string }>()
  const { data, isLoading, isFetching, refetch } = usePmbPortalDetail(uuid)
  const message = usePmbPortalMessage(uuid)
  const { data: school } = useSchool()
  const [body, setBody] = useState('')

  if (!getAuthToken() || getStoredUser()?.role !== 'pendaftar') return <Navigate to="/pmb/daftar" replace />
  if (isLoading || !data) {
    return <div className="py-16 text-sm text-muted-foreground">Memuat pendaftaran…</div>
  }

  if (data.status === 'draft') {
    return <Navigate to="/pmb/daftar" replace />
  }

  const statusLabel = data.status_label ?? PMB_STATUS_LABELS[data.status] ?? data.status.replaceAll('_', ' ')
  const statusDescription =
    data.status_description ?? PMB_STATUS_DESCRIPTIONS[data.status] ?? null
  const showTimeline = isPmbRegistrationSubmitted(data.status)
  const isAccepted = data.status === 'accepted'
  const showFormDocument = isPmbRegistrationSubmitted(data.status)

  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      {isAccepted && (
        <PmbAcceptedCelebration
          uuid={data.uuid}
          studentName={data.student_name}
          registrationNumber={data.registration_number}
        />
      )}

      <Card>
        <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
          <CardTitle className="text-lg leading-snug sm:text-xl">
            Pendaftaran {data.registration_number}
          </CardTitle>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <Badge
              variant="outline"
              className={cn(
                'shrink-0',
                isAccepted && 'border-emerald-600/40 bg-emerald-50 text-emerald-800',
              )}
            >
              {statusLabel}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-11 gap-2 touch-manipulation"
              onClick={() => void refetch()}
              disabled={isFetching}
              aria-label="Muat ulang"
            >
              <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} aria-hidden />
              Muat ulang
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {statusDescription && (
            <p className="rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
              {statusDescription}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">Calon siswa:</span> {data.student_name ?? 'Belum diisi'}
          </p>
          <p>
            <span className="text-muted-foreground">Status:</span> {statusLabel}
          </p>
        </CardContent>
      </Card>

      {showTimeline && (
        <Card>
          <CardHeader>
            <CardTitle>Proses pendaftaran</CardTitle>
          </CardHeader>
          <CardContent>
            <PmbStatusTimeline status={data.status} events={data.events} />
          </CardContent>
        </Card>
      )}

      <Card id="pesan">
        <CardHeader>
          <CardTitle>Pesan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <PmbMessageThread messages={data.messages ?? []} viewer="pendaftar" />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Tulis pesan untuk admin"
              className={cn('h-11', PMB_INPUT_TEXT)}
            />
            <Button
              className="h-11 w-full shrink-0 sm:w-auto"
              onClick={() => {
                if (!body.trim()) return
                message.mutate(body, { onSuccess: () => setBody('') })
              }}
              disabled={message.isPending}
            >
              Kirim
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card id="loa">
        <CardHeader>
          <CardTitle>Surat Penerimaan (LoA)</CardTitle>
        </CardHeader>
        <CardContent>
          {isAccepted ? (
            <PmbLoaDocument
              registration={data}
              schoolName={school?.name}
              schoolLogo={school?.logo}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              LoA tersedia setelah pendaftaran diterima. Saat status menjadi Diterima, surat dapat
              dicetak atau diunduh sebagai PDF.
            </p>
          )}
        </CardContent>
      </Card>

      {showFormDocument && (
        <Card id="formulir">
          <CardHeader>
            <CardTitle>Formulir Pendaftaran</CardTitle>
          </CardHeader>
          <CardContent>
            <PmbRegistrationFormDocument
              registration={data}
              schoolName={school?.name}
              schoolLogo={school?.logo}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
