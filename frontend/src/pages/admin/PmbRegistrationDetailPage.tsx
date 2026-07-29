import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Send,
  UserRound,
  XCircle,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { PmbMessageThread } from '@/components/pmb/PmbMessageThread'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminPmbMessage, useAdminPmbRegistrationByUuid, useUpdatePmbByUuid } from '@/hooks/usePmb'
import { PMB_STATUS_DESCRIPTIONS } from '@/config/pmb-portal-nav'
import { resolveAssetUrl } from '@/lib/safe-url'
import type { PmbAdminUpdateFormValues } from '@/schemas/pmb'
import { cn } from '@/lib/utils'

type AdminWritableStatus = NonNullable<PmbAdminUpdateFormValues['status']>

const ADMIN_WRITABLE_STATUSES: readonly AdminWritableStatus[] = [
  'draft',
  'awaiting_verification',
  'needs_revision',
  'accepted',
  'rejected',
]

function toAdminWritableStatus(value: string): AdminWritableStatus {
  return (ADMIN_WRITABLE_STATUSES as readonly string[]).includes(value)
    ? (value as AdminWritableStatus)
    : 'awaiting_verification'
}

const DRAFT_FIELD_LABELS: Record<string, string> = {
  nickname: 'Nama panggilan',
  address: 'Alamat',
  address_rt: 'RT',
  address_rw: 'RW',
  kabupaten: 'Kabupaten/Kota',
  provinsi: 'Provinsi',
  contact_phone: 'No. HP kontak',
  birth_place: 'Tempat lahir',
  birth_date: 'Tanggal lahir',
  relationship_to_child: 'Status anak',
  relationship_to_child_other: 'Status anak (lainnya)',
  child_order: 'Anak ke-',
  sibling_count: 'Jumlah saudara',
  academic_year: 'Tahun ajaran',
  student_name: 'Nama siswa',
  father_name: 'Nama ayah',
  mother_name: 'Nama ibu',
  father_phone: 'HP ayah',
  mother_phone: 'HP ibu',
  parent_email: 'Email aktif 1',
  email_secondary: 'Email aktif 2',
  grade_applied: 'Jenjang',
  previous_school: 'Sekolah sebelumnya',
  gender: 'Jenis kelamin',
}

const DRAFT_SKIP_KEYS = new Set([
  'student_photo_media_id',
  'payment_proof_media_id',
  'transfer_confirmed',
  'payment_transferred_at',
  'payment_note',
])

function isImageMime(mime: string | null | undefined): boolean {
  return Boolean(mime?.startsWith('image/'))
}

function formatDisplayDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function genderLabel(gender: string | null | undefined): string {
  if (gender === 'L') return 'Laki-laki'
  if (gender === 'P') return 'Perempuan'
  return gender || '—'
}

function draftFieldLabel(key: string): string {
  return DRAFT_FIELD_LABELS[key] ?? key.replace(/_/g, ' ')
}

function FieldItem({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={cn('min-w-0 space-y-1', className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm font-medium break-words text-foreground">{value || '—'}</div>
    </div>
  )
}

function MediaPreview({
  url,
  mimeType,
  name,
  alt,
  className,
}: {
  url: string | null | undefined
  mimeType?: string | null
  name?: string | null
  alt: string
  className?: string
}) {
  const safeUrl = url ? resolveAssetUrl(url, '') : ''
  if (!safeUrl) {
    return <p className="text-sm text-muted-foreground">Berkas belum tersedia.</p>
  }

  if (isImageMime(mimeType) || (!mimeType && !safeUrl.toLowerCase().includes('.pdf'))) {
    return (
      <a href={safeUrl} target="_blank" rel="noreferrer" className={cn('group block', className)}>
        <img
          src={safeUrl}
          alt={alt}
          className="max-h-80 w-full rounded-xl border border-primary/10 bg-muted/40 object-contain transition group-hover:border-primary/25"
        />
        <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
          Buka ukuran penuh
          <ExternalLink className="h-3 w-3" aria-hidden />
        </span>
      </a>
    )
  }

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl border border-primary/15 bg-muted/40 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5"
    >
      <FileText className="h-4 w-4 shrink-0" aria-hidden />
      <span className="truncate">{name || 'Buka berkas'}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </a>
  )
}

export function PmbRegistrationDetailPage() {
  const { t } = useTranslation('admin')
  const { uuid = '' } = useParams<{ uuid: string }>()
  const navigate = useNavigate()
  const { data, isLoading, refetch, isFetching } = useAdminPmbRegistrationByUuid(uuid)
  const updateItem = useUpdatePmbByUuid(uuid)
  const message = useAdminPmbMessage(uuid)
  const [status, setStatus] = useState<AdminWritableStatus>('awaiting_verification')
  const [notes, setNotes] = useState('')
  const [messageBody, setMessageBody] = useState('')

  useEffect(() => {
    if (!data) return
    setStatus(toAdminWritableStatus(data.status))
    setNotes(data.notes ?? '')
  }, [data])

  const draftEntries = useMemo(() => {
    if (!data?.draft_payload) return []
    return Object.entries(data.draft_payload).filter(([key, value]) => {
      if (DRAFT_SKIP_KEYS.has(key)) return false
      if (value === null || value === undefined || value === '') return false
      return true
    })
  }, [data?.draft_payload])

  if (isLoading || !data) {
    return <p className="text-sm text-muted-foreground">{t('common.loadingRegistration')}</p>
  }

  const paymentInfo = (data.payment_info ?? null) as Record<string, unknown> | null
  const hasPaymentProof = Boolean(paymentInfo?.proof_media_id || paymentInfo?.proof_url)
  const photoUrl = data.student_photo?.url ? resolveAssetUrl(data.student_photo.url, '') : ''
  const paymentVerified = Boolean(paymentInfo?.verified_at)
  const awaitingPayment = data.status === 'awaiting_verification' && !paymentVerified
  const statusHelp =
    data.status_description ||
    t(`pages.pmb.statusDesc.${status}`, { defaultValue: PMB_STATUS_DESCRIPTIONS[status] ?? '' })

  const actionPanel = (
    <Card className="admin-card-elevated border-primary/15" data-testid="pmb-action-panel">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{t('pages.pmb.registrationStatus')}</CardTitle>
          <AdminStatusBadge status={data.status} />
        </div>
        {statusHelp ? (
          <p className="rounded-md border border-primary/15 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {statusHelp}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Ubah status, verifikasi pembayaran, atau terbitkan LoA dari panel ini.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('form.status')}</Label>
          <Select value={status} onValueChange={(value) => setStatus(toAdminWritableStatus(value))}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draf</SelectItem>
              <SelectItem value="awaiting_verification">Menunggu verifikasi</SelectItem>
              <SelectItem value="needs_revision">Perlu perbaikan</SelectItem>
              <SelectItem value="accepted">{t('status.accepted')}</SelectItem>
              <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t(`pages.pmb.statusDesc.${status}`, {
              defaultValue: PMB_STATUS_DESCRIPTIONS[status] ?? '',
            })}
          </p>
          {status === 'needs_revision' && (
            <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
              Status ini membuka form edit untuk pendaftar di menu Perbaiki data.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">{t('form.adminNotes')}</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="min-h-24 resize-y"
            placeholder="Contoh: Mohon lengkapi fotokopi KK…"
          />
          <p className="text-xs text-muted-foreground">{t('form.adminNotesHint')}</p>
        </div>
        <div className="space-y-2 border-t border-primary/10 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tindakan cepat</p>
          <Button
            type="button"
            className="min-h-11 w-full justify-start gap-2"
            variant={awaitingPayment ? 'default' : 'outline'}
            onClick={() => updateItem.mutate({ action: 'verify_payment' })}
            disabled={updateItem.isPending}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Verifikasi pembayaran
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
            onClick={() => updateItem.mutate({ action: 'reject_payment' })}
            disabled={updateItem.isPending}
          >
            <XCircle className="h-4 w-4" aria-hidden />
            Tolak pembayaran
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full justify-start gap-2"
            disabled={data.status !== 'accepted' || updateItem.isPending}
            onClick={() => updateItem.mutate({ action: 'issue_loa' })}
          >
            <FileText className="h-4 w-4" aria-hidden />
            Terbitkan LoA
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <AdminFormShell
      title={t('pages.pmb.detailTitle', { number: data.registration_number })}
      description={data.student_name ?? undefined}
      backHref="/admin/pmb-registrations"
      actions={
        <Button
          type="button"
          variant="outline"
          className="min-h-11 gap-2 touch-manipulation"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label={t('common.refresh')}
        >
          <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} aria-hidden />
          {t('common.refresh')}
        </Button>
      }
      onSubmit={() =>
        updateItem.mutate({
          status,
          notes: notes || null,
        })
      }
      onCancel={() => navigate('/admin/pmb-registrations')}
      isSubmitting={updateItem.isPending}
      submitLabel={t('common.saveStatus')}
    >
      <Card className="admin-card overflow-hidden border-primary/10" data-testid="pmb-profile-header">
        <div className="bg-gradient-to-br from-primary/[0.08] via-card to-gold/5 p-4 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="mx-auto shrink-0 sm:mx-0">
              {photoUrl ? (
                <a href={photoUrl} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={photoUrl}
                    alt={`Foto ${data.student_name ?? 'siswa'}`}
                    className="h-28 w-28 rounded-2xl border-2 border-background object-cover shadow-md sm:h-32 sm:w-32"
                  />
                </a>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-muted/50 sm:h-32 sm:w-32">
                  <UserRound className="h-10 w-10 text-muted-foreground" aria-hidden />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:items-start">
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {data.student_name ?? 'Tanpa nama'}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <AdminStatusBadge status={data.status} />
                  <span className="rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-primary/10">
                    {data.registration_number}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.grade_applied}
                {data.academic_year ? ` · TA ${data.academic_year}` : ''}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
                <p className="text-sm">
                  <span className="text-muted-foreground">Orang tua: </span>
                  <span className="font-medium">{data.parent_name}</span>
                </p>
                {data.parent_phone && (
                  <a
                    href={`tel:${data.parent_phone}`}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 text-sm font-medium text-primary sm:min-h-0 sm:justify-start"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {data.parent_phone}
                  </a>
                )}
                {data.parent_email && (
                  <a
                    href={`mailto:${data.parent_email}`}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 text-sm font-medium text-primary sm:min-h-0 sm:justify-start"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {data.parent_email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <aside className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-4 lg:self-start">
          {actionPanel}
        </aside>

        <div className="order-2 space-y-6 lg:order-1">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-base">{t('pages.pmb.studentData')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FieldItem label={t('pages.pmb.field.name')} value={data.student_name} />
              <FieldItem
                label={t('pages.pmb.field.birthPlaceDate')}
                value={`${data.birth_place ?? '—'} / ${formatDisplayDate(data.birth_date)}`}
              />
              <FieldItem label={t('pages.pmb.field.gender')} value={genderLabel(data.gender)} />
              <FieldItem label={t('pages.pmb.field.academicYear')} value={data.academic_year} />
              <FieldItem label={t('pages.pmb.field.grade')} value={data.grade_applied} />
              <FieldItem label={t('pages.pmb.field.previousSchool')} value={data.previous_school} />
              <FieldItem label={t('pages.pmb.field.address')} value={data.address} className="sm:col-span-2" />
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-base">{t('pages.pmb.parentData')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FieldItem label={t('pages.pmb.field.name')} value={data.parent_name} />
              <FieldItem
                label={t('pages.pmb.field.phone')}
                value={
                  data.parent_phone ? (
                    <a href={`tel:${data.parent_phone}`} className="text-primary hover:underline">
                      {data.parent_phone}
                    </a>
                  ) : (
                    '—'
                  )
                }
              />
              <FieldItem
                label={t('pages.pmb.field.email')}
                value={
                  data.parent_email ? (
                    <a href={`mailto:${data.parent_email}`} className="text-primary hover:underline">
                      {data.parent_email}
                    </a>
                  ) : (
                    '—'
                  )
                }
                className="sm:col-span-2"
              />
            </CardContent>
          </Card>

          {hasPaymentProof && (
            <Card className="admin-card border-gold/20">
              <CardHeader>
                <CardTitle className="text-base">Bukti pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MediaPreview
                  url={typeof paymentInfo?.proof_url === 'string' ? paymentInfo.proof_url : null}
                  mimeType={typeof paymentInfo?.proof_mime_type === 'string' ? paymentInfo.proof_mime_type : null}
                  name={typeof paymentInfo?.proof_name === 'string' ? paymentInfo.proof_name : null}
                  alt="Bukti pembayaran pendaftaran"
                  className="max-w-xl"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldItem
                    label="Tanggal transfer"
                    value={formatDisplayDate(
                      typeof paymentInfo?.transferred_at === 'string' ? paymentInfo.transferred_at : null,
                    )}
                  />
                  <FieldItem
                    label="Catatan"
                    value={typeof paymentInfo?.note === 'string' ? paymentInfo.note : '—'}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {draftEntries.length > 0 && (
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="text-base">Data lengkap formulir</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {draftEntries.map(([key, value]) => (
                  <FieldItem key={key} label={draftFieldLabel(key)} value={String(value)} />
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-base">Pesan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PmbMessageThread messages={data.messages ?? []} viewer="admin" />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  placeholder="Tulis pesan ke pendaftar…"
                  className="min-h-11"
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' || event.shiftKey) return
                    event.preventDefault()
                    if (!messageBody.trim()) return
                    message.mutate(messageBody, { onSuccess: () => setMessageBody('') })
                  }}
                />
                <Button
                  type="button"
                  className="min-h-11 shrink-0 gap-2 sm:w-auto"
                  disabled={!messageBody.trim() || message.isPending}
                  onClick={() => {
                    if (!messageBody.trim()) return
                    message.mutate(messageBody, { onSuccess: () => setMessageBody('') })
                  }}
                >
                  <Send className="h-4 w-4" aria-hidden />
                  Kirim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminFormShell>
  )
}
