import { AlertTriangle, ClipboardCheck, CreditCard, ExternalLink, Eye, User, UserRound } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { PmbFormSection } from '@/components/pmb/PmbFormSection'
import { Button } from '@/components/ui/button'
import { formatIndonesiaPhone } from '@/lib/phone-id'
import { resolveAssetUrl } from '@/lib/safe-url'
import { formatRelationshipToChild, type PmbPortalDraftValues } from '@/schemas/pmb'

interface PmbWizardStepRingkasanProps {
  form: UseFormReturn<PmbPortalDraftValues>
  variant?: 'confirm' | 'readonly'
  /** When confirming a correction (status needs_revision), copy mentions perbaikan — not first submit. */
  isCorrection?: boolean
  /** Jump back to a wizard step to edit fields (correction mode). */
  onEditStep?: (stepIndex: number) => void
  statusHref?: string
  studentPhotoUrl?: string | null
  paymentProofUrl?: string | null
  paymentProofMimeType?: string | null
  paymentProofName?: string | null
}

function SummaryRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid gap-0.5 border-b border-primary/10 py-2.5 last:border-0 sm:grid-cols-2 sm:gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium break-words">{value || '—'}</span>
    </div>
  )
}

function MediaThumb({
  url,
  alt,
  mimeType,
  name,
}: {
  url: string
  alt: string
  mimeType?: string | null
  name?: string | null
}) {
  const safeUrl = resolveAssetUrl(url, '')
  if (!safeUrl) return null

  const isImage = mimeType?.startsWith('image/') ?? !safeUrl.toLowerCase().includes('.pdf')

  if (isImage) {
    return (
      <a href={safeUrl} target="_blank" rel="noreferrer" className="mt-2 block max-w-xs">
        <img
          src={safeUrl}
          alt={alt}
          className="max-h-48 w-full rounded-xl border border-primary/10 object-contain bg-muted/30"
        />
      </a>
    )
  }

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/15 px-3 py-2 text-sm font-medium text-primary"
    >
      {name || 'Buka berkas'}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  )
}

export function PmbWizardStepRingkasan({
  form,
  variant = 'confirm',
  isCorrection = false,
  onEditStep,
  statusHref,
  studentPhotoUrl,
  paymentProofUrl,
  paymentProofMimeType,
  paymentProofName,
}: PmbWizardStepRingkasanProps) {
  const values = form.getValues()
  const isReadonly = variant === 'readonly'
  const addressParts = [
    values.address,
    values.address_rt || values.address_rw
      ? `RT ${values.address_rt || '—'} / RW ${values.address_rw || '—'}`
      : null,
    [values.kabupaten, values.provinsi].filter(Boolean).join(', ') || null,
  ].filter(Boolean)

  const editLink = (stepIndex: number, label: string) =>
    onEditStep ? (
      <Button
        type="button"
        variant="link"
        className="h-auto px-0 text-xs font-medium text-primary"
        onClick={() => onEditStep(stepIndex)}
      >
        Ubah {label}
      </Button>
    ) : null

  return (
    <div className="space-y-5">
      {isReadonly ? (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <Eye className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Pendaftaran sudah dikirim</p>
            <p className="text-muted-foreground">
              Data di bawah hanya untuk dilihat. Bila admin meminta perbaikan, menu Perbaiki data akan
              tersedia.
            </p>
            {statusHref && (
              <Button asChild variant="outline" className="mt-1 h-11 w-full sm:w-auto">
                <Link to={statusHref}>Lihat status & timeline</Link>
              </Button>
            )}
          </div>
        </div>
      ) : isCorrection ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <p className="text-sm text-amber-900 dark:text-amber-100">
            Periksa kembali data perbaikan Anda. Setelah dikirim, admin akan meninjau ulang pendaftaran.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <p className="text-sm text-amber-900 dark:text-amber-100">
            Periksa kembali data Anda. Setelah dikirim, pendaftaran akan menunggu verifikasi pembayaran dan tidak
            dapat diubah sendiri.
          </p>
        </div>
      )}

      <PmbFormSection
        icon={User}
        title="Data Diri"
        description="Identitas calon siswa dan kontak."
        action={editLink(0, 'data diri')}
      >
        {studentPhotoUrl && (
          <div className="border-b border-primary/10 py-2.5">
            <p className="text-sm text-muted-foreground">Foto siswa</p>
            <MediaThumb url={studentPhotoUrl} alt={`Foto ${values.student_name || 'siswa'}`} mimeType="image/jpeg" />
          </div>
        )}
        <SummaryRow label="Nama Lengkap" value={values.student_name} />
        <SummaryRow label="Nama Panggilan" value={values.nickname} />
        <SummaryRow label="Alamat" value={addressParts.join(' · ') || null} />
        <SummaryRow
          label="Handphone"
          value={values.contact_phone ? formatIndonesiaPhone(values.contact_phone) : null}
        />
        <SummaryRow
          label="Tempat / Tanggal Lahir"
          value={`${values.birth_place ?? '—'} / ${values.birth_date ?? '—'}`}
        />
        <SummaryRow
          label="Status Anak"
          value={formatRelationshipToChild(values.relationship_to_child, values.relationship_to_child_other)}
        />
        <SummaryRow
          label="Anak ke / Dari saudara ke"
          value={`${values.child_order ?? '—'} / ${values.sibling_count ?? '—'}`}
        />
        <SummaryRow label="Tahun Ajaran" value={values.academic_year} />
      </PmbFormSection>

      <PmbFormSection
        icon={UserRound}
        title="Data Orang Tua"
        description="Kontak ayah, ibu, dan email."
        action={editLink(1, 'orang tua')}
      >
        <SummaryRow label="Nama Ayah" value={values.father_name} />
        <SummaryRow label="Nama Ibu" value={values.mother_name} />
        <SummaryRow label="HP Ayah" value={values.father_phone} />
        <SummaryRow label="HP Ibu" value={values.mother_phone} />
        <SummaryRow label="Email Aktif 1" value={values.parent_email} />
        <SummaryRow label="Email Aktif 2" value={values.email_secondary} />
      </PmbFormSection>

      <PmbFormSection
        icon={CreditCard}
        title="Pembayaran"
        description="Detail transfer yang diunggah."
        action={editLink(2, 'pembayaran / bukti')}
      >
        <SummaryRow label="Tanggal Transfer" value={values.payment_transferred_at} />
        <SummaryRow label="Catatan" value={values.payment_note} />
        <SummaryRow label="Bukti Diunggah" value={values.payment_proof_media_id || paymentProofUrl ? 'Ya' : 'Belum'} />
        {paymentProofUrl && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">Bukti pembayaran</p>
            <MediaThumb
              url={paymentProofUrl}
              alt="Bukti pembayaran pendaftaran"
              mimeType={paymentProofMimeType}
              name={paymentProofName}
            />
          </div>
        )}
      </PmbFormSection>

      {!isReadonly && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          <ClipboardCheck className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            {isCorrection ? (
              <>
                Klik <strong>Kirim perbaikan</strong> jika semua data sudah benar.
              </>
            ) : (
              <>
                Klik <strong>Kirim Pendaftaran</strong> jika semua data sudah benar.
              </>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
