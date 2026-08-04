import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'
import { formatIndonesiaPhone, INDONESIA_PHONE_REGEX } from '@/lib/phone-id'
import { formatCapitalizeFirst, formatTitleCaseWords } from '@/lib/text-format'
import { getAcademicYear } from '@/lib/academic-year'

export const RELATIONSHIP_OPTIONS = ['Anak kandung', 'Anak tiri', 'Lainnya'] as const

export type RelationshipOption = (typeof RELATIONSHIP_OPTIONS)[number]

export function formatRelationshipToChild(
  relationship?: string | null,
  other?: string | null,
): string {
  if (!relationship) {
    return '—'
  }

  if (relationship === 'Lainnya') {
    const detail = other?.trim()
    return detail || 'Lainnya'
  }

  return relationship
}

export const WIZARD_STEP_LABELS = ['Data Diri', 'Orang Tua', 'Pembayaran', 'Ringkasan'] as const

export const WIZARD_STEP_DESCRIPTIONS: Record<(typeof WIZARD_STEP_LABELS)[number], string> = {
  'Data Diri': 'Lengkapi identitas calon siswa dan informasi kontak.',
  'Orang Tua': 'Data ayah, ibu, dan email untuk notifikasi status.',
  Pembayaran: 'Transfer biaya pendaftaran dan unggah bukti pembayaran.',
  Ringkasan: 'Periksa kembali semua data sebelum mengirim pendaftaran.',
}

export const indonesiaPhoneSchema = z
  .string()
  .trim()
  .min(1, 'Nomor handphone wajib diisi.')
  .transform((value) => formatIndonesiaPhone(value))
  .refine((value) => INDONESIA_PHONE_REGEX.test(value), {
    message: 'Nomor handphone harus format +62 diikuti angka (9–13 digit).',
  })

const positiveIntString = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === 'number' ? String(v) : v.trim()))
  .refine((v) => v === '' || (/^\d+$/.test(v) && Number(v) > 0), {
    message: 'Harus berupa angka positif.',
  })

const personNameString = (message: string, max = 200) =>
  z.string().trim().min(1, message).max(max).transform(formatTitleCaseWords)

const optionalPersonNameString = (max = 100) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value ? formatTitleCaseWords(value) : value))

const sentenceStartString = (message: string, max: number) =>
  z.string().trim().min(1, message).max(max).transform(formatCapitalizeFirst)

const optionalSentenceStartString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value ? formatCapitalizeFirst(value) : value))

const optionalRtRwString = (label: string) =>
  z
    .string()
    .trim()
    .max(3)
    .optional()
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : ''))
    .refine((value) => value === '' || /^\d{1,3}$/.test(value), {
      message: `${label} harus berupa angka (maks. 3 digit).`,
    })

export const pmbDataDiriStepSchema = z
  .object({
    student_name: personNameString('Nama lengkap wajib diisi.'),
    nickname: optionalPersonNameString(100),
    address: sentenceStartString('Alamat wajib diisi.', 500),
    address_rt: optionalRtRwString('RT'),
    address_rw: optionalRtRwString('RW'),
    kabupaten: personNameString('Kabupaten/Kota wajib diisi.', 100),
    provinsi: personNameString('Provinsi wajib diisi.', 100),
    contact_phone: indonesiaPhoneSchema,
    birth_place: personNameString('Tempat lahir wajib diisi.', 100),
    birth_date: z.string().min(1, 'Tanggal lahir wajib diisi.'),
    relationship_to_child: z.enum(RELATIONSHIP_OPTIONS, {
      errorMap: () => ({ message: 'Status anak wajib dipilih.' }),
    }),
    relationship_to_child_other: optionalPersonNameString(100),
    child_order: positiveIntString,
    sibling_count: positiveIntString,
    academic_year: z.string().default(() => getAcademicYear()),
    student_photo_media_id: z.number().int().positive('Foto siswa wajib diunggah.'),
  })
  .superRefine((data, ctx) => {
    if (data.relationship_to_child !== 'Lainnya') {
      return
    }

    if (!data.relationship_to_child_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sebutkan status anak lainnya.',
        path: ['relationship_to_child_other'],
      })
    }
  })

export const pmbOrangTuaStepSchema = z
  .object({
    father_name: personNameString('Nama ayah wajib diisi.'),
    mother_name: personNameString('Nama ibu wajib diisi.'),
    father_phone: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((v) => (v ? formatIndonesiaPhone(v) : '')),
    mother_phone: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((v) => (v ? formatIndonesiaPhone(v) : '')),
    parent_email: z.string().trim().email('Email aktif 1 tidak valid.'),
    email_secondary: z
      .string()
      .trim()
      .email('Email aktif 2 tidak valid.')
      .optional()
      .or(z.literal(''))
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const hasFather = data.father_phone && INDONESIA_PHONE_REGEX.test(data.father_phone)
    const hasMother = data.mother_phone && INDONESIA_PHONE_REGEX.test(data.mother_phone)
    if (!hasFather && !hasMother) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Minimal isi nomor HP ayah atau ibu.',
        path: ['father_phone'],
      })
    }
    if (data.father_phone && !INDONESIA_PHONE_REGEX.test(data.father_phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Format HP ayah harus +62 diikuti angka.',
        path: ['father_phone'],
      })
    }
    if (data.mother_phone && !INDONESIA_PHONE_REGEX.test(data.mother_phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Format HP ibu harus +62 diikuti angka.',
        path: ['mother_phone'],
      })
    }
  })

export const pmbPaymentStepSchema = z.object({
  pmb_fee_uuid: z.string().uuid('Pilih jenjang dan program biaya pendaftaran.'),
  payment_proof_media_id: z.number().int().positive('Bukti transfer wajib diunggah.'),
  payment_transferred_at: z.string().optional().nullable(),
  payment_note: optionalSentenceStartString(500),
  transfer_confirmed: z.literal(true, {
    errorMap: () => ({ message: 'Anda harus menyetujui bahwa transfer sudah dilakukan.' }),
  }),
})

/** Loose schema for RHF defaults and autosave — per-step schemas validate on "Lanjut". */
export const pmbPortalDraftSchema = z.object({
  student_name: z.string().optional(),
  nickname: z.string().optional().nullable(),
  address: z.string().optional(),
  address_rt: z.string().optional(),
  address_rw: z.string().optional(),
  kabupaten: z.string().optional(),
  provinsi: z.string().optional(),
  contact_phone: z.string().optional(),
  birth_place: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  relationship_to_child: z.enum(RELATIONSHIP_OPTIONS).optional(),
  relationship_to_child_other: z.string().optional().nullable(),
  child_order: z.union([z.string(), z.number()]).optional(),
  sibling_count: z.union([z.string(), z.number()]).optional(),
  academic_year: z.string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  father_phone: z.string().optional().nullable(),
  mother_phone: z.string().optional().nullable(),
  parent_email: z.string().optional(),
  email_secondary: z.string().optional().nullable(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  school_id: z.number().int().positive().optional(),
  gender: z.enum(['L', 'P']).optional().nullable(),
  grade_applied: z.string().optional().nullable(),
  previous_school: z.string().optional().nullable(),
  pmb_fee_uuid: z.string().uuid().optional().nullable(),
  jenjang: z.enum(['tk', 'sd']).optional().nullable(),
  program: z.enum(['reguler', 'icp']).optional().nullable(),
  fee_name: z.string().optional().nullable(),
  payment_proof_media_id: z.number().optional(),
  student_photo_media_id: z.number().optional(),
  payment_transferred_at: z.string().optional().nullable(),
  payment_note: z.string().optional().nullable(),
  transfer_confirmed: z.boolean().optional(),
})

export type PmbPortalDraftValues = z.infer<typeof pmbPortalDraftSchema>

export function buildDraftPayload(values: Partial<PmbPortalDraftValues>) {
  return {
    nickname: values.nickname ?? null,
    contact_phone: values.contact_phone ?? null,
    relationship_to_child: values.relationship_to_child ?? null,
    relationship_to_child_other:
      values.relationship_to_child === 'Lainnya' ? values.relationship_to_child_other?.trim() || null : null,
    child_order: values.child_order ?? null,
    sibling_count: values.sibling_count ?? null,
    academic_year: values.academic_year ?? getAcademicYear(),
    father_name: values.father_name ?? null,
    mother_name: values.mother_name ?? null,
    father_phone: values.father_phone ?? null,
    mother_phone: values.mother_phone ?? null,
    email_secondary: values.email_secondary || null,
    transfer_confirmed: values.transfer_confirmed ?? false,
    student_photo_media_id: values.student_photo_media_id ?? null,
    address_rt: values.address_rt ?? null,
    address_rw: values.address_rw ?? null,
    kabupaten: values.kabupaten ?? null,
    provinsi: values.provinsi ?? null,
    pmb_fee_uuid: values.pmb_fee_uuid ?? null,
    jenjang: values.jenjang ?? null,
    program: values.program ?? null,
    fee_name: values.fee_name ?? null,
  }
}

export function syncLegacyParentFields(values: Partial<PmbPortalDraftValues>) {
  const parent_name = values.father_name || values.mother_name || ''
  const parent_phone = values.father_phone || values.mother_phone || values.contact_phone || ''
  return { parent_name, parent_phone }
}

export function createPmbRegisterSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    student_name: z.string().min(1, t('validation.studentNameRequired')).max(200),
    birth_place: z.string().max(100).optional().nullable(),
    birth_date: z.string().optional().nullable(),
    gender: z.enum(['L', 'P']).optional().nullable(),
    parent_name: z.string().min(1, t('validation.parentNameRequired')).max(200),
    parent_phone: z.string().min(1, t('validation.phoneRequired')).max(30),
    parent_email: z.string().email(t('validation.emailInvalid')).optional().nullable().or(z.literal('')),
    address: z.string().optional().nullable(),
    previous_school: z.string().max(250).optional().nullable(),
    grade_applied: z.string().min(1, t('validation.gradeRequired')).max(50),
  })
}

export function createPmbAdminUpdateSchema(_t: AdminTFunction) {
  return z.object({
    status: z
      .enum(['draft', 'awaiting_verification', 'needs_revision', 'accepted', 'rejected'])
      .optional(),
    notes: z.string().optional().nullable(),
    grade_applied: z.string().max(50).optional().nullable(),
    action: z.enum(['verify_payment', 'reject_payment', 'issue_loa']).optional(),
    payment_notes: z.string().max(1000).optional().nullable(),
  })
}

export const pmbRegisterSchema = createPmbRegisterSchema(defaultAdminT)
export const pmbAdminUpdateSchema = createPmbAdminUpdateSchema(defaultAdminT)

export type PmbRegisterFormValues = z.infer<ReturnType<typeof createPmbRegisterSchema>>
export type PmbAdminUpdateFormValues = z.infer<ReturnType<typeof createPmbAdminUpdateSchema>>
