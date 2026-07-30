import { PmbDocumentActions } from '@/components/pmb/PmbDocumentActions'
import {
  draftStr,
  formatIdDate,
  formatIdDateTime,
  genderLabel,
  PmbDocumentBarcode,
} from '@/components/pmb/pmb-document-utils'
import { resolveAssetUrl } from '@/lib/safe-url'
import type { PmbRegistration } from '@/types'
import { cn } from '@/lib/utils'

interface PmbLoaDocumentProps {
  registration: PmbRegistration
  schoolName?: string | null
  schoolLogo?: string | null
  className?: string
}

export function PmbLoaDocument({
  registration,
  schoolName = 'Sekolah Nurul Hikmah Sidoarjo',
  schoolLogo,
  className,
}: PmbLoaDocumentProps) {
  const draft = (registration.draft_payload ?? {}) as Record<string, unknown>
  const logoSrc = resolveAssetUrl(schoolLogo, '/logo.png')
  const photoSrc = registration.student_photo?.url
    ? resolveAssetUrl(registration.student_photo.url, '')
    : null
  const issuedAt = registration.loa_issued_at ?? registration.updated_at ?? new Date().toISOString()
  const academicYear =
    registration.academic_year || draftStr(draft, 'academic_year') || '—'
  const grade = registration.grade_applied || draftStr(draft, 'grade_applied') || '—'
  const nickname = draftStr(draft, 'nickname')

  return (
    <div className={cn('space-y-3', className)}>
      <PmbDocumentActions kind="loa" pdfLabel="Simpan LoA (PDF)" printLabel="Cetak LoA" />

      <div
        className="pmb-print-root overflow-hidden rounded-xl border border-primary/15 bg-white text-zinc-900 shadow-sm"
        data-print="loa"
        data-testid="pmb-loa-document"
      >
        <article className="pmb-doc-sheet relative mx-auto max-w-[210mm] px-5 py-6 sm:px-8 sm:py-8">
          <img
            src={logoSrc}
            alt=""
            className="pointer-events-none absolute top-1/2 left-1/2 h-[55%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
            aria-hidden
          />

          <header className="relative z-10 flex flex-col items-center gap-2 border-b border-zinc-300 pb-4 text-center">
            <img src={logoSrc} alt={schoolName ?? 'Logo sekolah'} className="h-16 w-16 object-contain" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                {schoolName}
              </p>
              <h3 className="mt-1 text-base font-bold uppercase leading-snug sm:text-lg">
                Surat Penerimaan Siswa Baru (LoA)
              </h3>
              <p className="mt-1 font-mono text-sm font-semibold">
                NO. REG : {registration.registration_number}
              </p>
            </div>
          </header>

          <div className="relative z-10 mt-5 space-y-4 text-sm leading-relaxed">
            <p>
              Dengan ini panitia SPMB menyatakan bahwa calon siswa berikut{' '}
              <strong>DITERIMA</strong> sebagai peserta didik baru:
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <dl className="min-w-0 flex-1 grid gap-1.5 sm:grid-cols-[10rem_1fr] sm:gap-x-3">
                <dt className="text-zinc-600">Nama siswa</dt>
                <dd className="font-semibold uppercase">
                  {registration.student_name ?? '—'}
                  {nickname ? ` (${nickname})` : ''}
                </dd>
                <dt className="text-zinc-600">Tempat / tgl lahir</dt>
                <dd>
                  {(registration.birth_place || draftStr(draft, 'birth_place') || '—').toUpperCase()},{' '}
                  {formatIdDate(registration.birth_date || draftStr(draft, 'birth_date') || null)}
                </dd>
                <dt className="text-zinc-600">Jenis kelamin</dt>
                <dd>{genderLabel(registration.gender ?? (draftStr(draft, 'gender') as 'L' | 'P' | ''))}</dd>
                <dt className="text-zinc-600">Jenjang / program</dt>
                <dd className="uppercase">{grade}</dd>
                <dt className="text-zinc-600">Tahun ajaran</dt>
                <dd>{academicYear}</dd>
                <dt className="text-zinc-600">No. registrasi</dt>
                <dd className="font-mono font-semibold">{registration.registration_number}</dd>
              </dl>

              {photoSrc ? (
                <div
                  className="mx-auto shrink-0 overflow-hidden rounded border border-zinc-400 bg-zinc-50 sm:mx-0"
                  data-testid="pmb-loa-student-photo"
                >
                  <img
                    src={photoSrc}
                    alt={registration.student_name ? `Foto ${registration.student_name}` : 'Foto siswa'}
                    className="h-[4.5cm] w-[3.5cm] object-cover"
                  />
                </div>
              ) : null}
            </div>

            <p>
              Orang tua/wali diharapkan menyelesaikan kewajiban administrasi dan mengikuti prosedur
              yang ditetapkan sekolah. Surat ini berlaku sebagai bukti penerimaan resmi.
            </p>

            <PmbDocumentBarcode value={registration.registration_number} />

            <div className="mt-6 grid grid-cols-2 gap-4 pt-2 text-center text-sm">
              <div>
                <p className="mb-12">Sidoarjo, {formatIdDateTime(issuedAt)}</p>
                <p className="font-semibold">Panitia SPMB</p>
                <p className="mt-10 text-zinc-500">……………………</p>
              </div>
              <div>
                <p className="mb-12 invisible">.</p>
                <p className="font-semibold">Pemohon</p>
                <p className="mt-10 font-semibold uppercase">
                  {registration.parent_name ||
                    draftStr(draft, 'father_name') ||
                    draftStr(draft, 'mother_name') ||
                    '……………………'}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
