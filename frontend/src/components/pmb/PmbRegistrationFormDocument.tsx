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

interface PmbRegistrationFormDocumentProps {
  registration: PmbRegistration
  schoolName?: string | null
  schoolLogo?: string | null
  className?: string
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm">
      <span className="inline-block min-w-[9.5rem] text-zinc-700 sm:min-w-[11rem]">{label}</span>
      <span className="mx-1">:</span>
      <span className="font-medium uppercase">{value || '—'}</span>
    </p>
  )
}

export function PmbRegistrationFormDocument({
  registration,
  schoolName = 'Sekolah Nurul Hikmah Sidoarjo',
  schoolLogo,
  className,
}: PmbRegistrationFormDocumentProps) {
  const draft = (registration.draft_payload ?? {}) as Record<string, unknown>
  const logoSrc = resolveAssetUrl(schoolLogo, '/logo.png')

  const addressParts = [
    registration.address || draftStr(draft, 'address'),
    draftStr(draft, 'address_rt') ? `RT. ${draftStr(draft, 'address_rt')}` : '',
    draftStr(draft, 'address_rw') ? `RW.${draftStr(draft, 'address_rw')}` : '',
    draftStr(draft, 'kabupaten'),
    draftStr(draft, 'provinsi'),
  ].filter(Boolean)
  const address = addressParts.join(' ')

  const relationship =
    draftStr(draft, 'relationship_to_child') === 'Lainnya'
      ? draftStr(draft, 'relationship_to_child_other')
      : draftStr(draft, 'relationship_to_child')

  const applicantName =
    draftStr(draft, 'mother_name') ||
    registration.parent_name ||
    draftStr(draft, 'father_name') ||
    '—'

  const fatherName = draftStr(draft, 'father_name') || registration.parent_name || '—'
  const motherName = draftStr(draft, 'mother_name') || '—'
  const fatherPhone = draftStr(draft, 'father_phone') || registration.parent_phone || '—'
  const motherPhone = draftStr(draft, 'mother_phone') || draftStr(draft, 'contact_phone') || '—'
  const email =
    draftStr(draft, 'parent_email') || registration.parent_email || draftStr(draft, 'email_secondary') || '—'
  const nickname = draftStr(draft, 'nickname')
  const childOrder = draftStr(draft, 'child_order') || '—'
  const siblingCount = draftStr(draft, 'sibling_count') || '0'
  const academicYear = registration.academic_year || draftStr(draft, 'academic_year') || '—'
  const grade = registration.grade_applied || draftStr(draft, 'grade_applied') || '—'
  const gender = genderLabel(registration.gender ?? (draftStr(draft, 'gender') as 'L' | 'P' | ''))
  const birthPlace = (registration.birth_place || draftStr(draft, 'birth_place') || '—').toUpperCase()
  const birthDate = formatIdDate(registration.birth_date || draftStr(draft, 'birth_date') || null)
  const contactPhone = draftStr(draft, 'contact_phone') || registration.parent_phone || '—'
  const stampedAt = registration.updated_at || registration.created_at

  return (
    <div className={cn('space-y-3', className)}>
      <PmbDocumentActions kind="form" pdfLabel="Simpan Formulir (PDF)" printLabel="Cetak Formulir" />

      <div
        className="pmb-print-root overflow-hidden rounded-xl border border-primary/15 bg-white text-zinc-900 shadow-sm"
        data-print="form"
        data-testid="pmb-registration-form-document"
      >
        <article className="pmb-doc-sheet relative mx-auto max-w-[210mm] px-5 py-6 sm:px-8 sm:py-8">
          <img
            src={logoSrc}
            alt=""
            className="pointer-events-none absolute top-1/2 left-1/2 h-[55%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
            aria-hidden
          />

          <header className="relative z-10 flex flex-col items-center gap-2 border-b border-zinc-300 pb-3 text-center">
            <img src={logoSrc} alt={schoolName ?? 'Logo sekolah'} className="h-16 w-16 object-contain" />
            <h3 className="text-sm font-bold uppercase leading-snug sm:text-base">
              Formulir Pendaftaran {schoolName}
            </h3>
            <p className="font-mono text-sm font-semibold">NO. REG : {registration.registration_number}</p>
          </header>

          <div className="relative z-10 mt-4 space-y-4">
            <section className="space-y-1">
              <Row label="Nama" value={applicantName} />
              <Row label="Alamat" value={address} />
              <Row label="No. Handphone" value={contactPhone} />
              <Row label="Hubungan dengan Anak" value={relationship || '—'} />
            </section>

            <section>
              <p className="mb-1 text-sm font-bold underline">Data Orang Tua</p>
              <div className="space-y-1">
                <Row label="Nama Ayah" value={fatherName} />
                <Row label="Nama Ibu" value={motherName} />
                <Row label="Alamat" value={address} />
                <Row label="No. Handphone Ayah" value={fatherPhone} />
                <Row label="No. Handphone Ibu" value={motherPhone} />
                <Row label="Email" value={email} />
              </div>
            </section>

            <section className="space-y-1 text-sm">
              <p>
                Bermaksud mendaftarkan putra / putri kami pada sistem{' '}
                <strong className="uppercase">Reguler</strong> :
              </p>
              <Row
                label="Nama"
                value={
                  nickname
                    ? `${registration.student_name ?? '—'} (${nickname})`
                    : registration.student_name ?? '—'
                }
              />
              <Row label="Tempat, Tanggal Lahir" value={`${birthPlace}, ${birthDate}`} />
              <Row label="Jenis Kelamin" value={gender} />
              <Row label="Anak ke" value={`${childOrder} Dari saudara ke ${siblingCount}`} />
              <Row label="Pada" value={grade} />
              <Row label="Ajaran" value={academicYear} />
            </section>

            <p className="text-sm leading-relaxed">
              Demikian formulir pendaftaran ini kami buat dengan sebenar-benarnya dan bersedia
              membayar kewajiban serta mengikuti prosedur yang berlaku di sekolah.
            </p>

            <PmbDocumentBarcode value={registration.registration_number} />

            <div className="mt-4 grid grid-cols-2 gap-4 pt-2 text-center text-sm">
              <div>
                <p className="mb-12">Sidoarjo, {formatIdDateTime(stampedAt)}</p>
                <p className="font-semibold">Panitia SPMB</p>
                <p className="mt-10 text-zinc-500">……………………</p>
              </div>
              <div>
                <p className="mb-12 invisible">.</p>
                <p className="font-semibold">Pemohon</p>
                <p className="mt-10 font-semibold uppercase">{applicantName}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
