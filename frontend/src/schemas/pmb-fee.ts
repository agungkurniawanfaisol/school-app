import { z } from 'zod'

export const PMB_FEE_JENJANGS = ['kb', 'tk', 'sd'] as const
export type PmbFeeJenjang = (typeof PMB_FEE_JENJANGS)[number]

export const pmbFeeFormSchema = z.object({
  school_id: z.number().int().positive(),
  academic_year_id: z.number().int().positive('Tahun ajaran wajib dipilih.'),
  name: z.string().trim().min(1, 'Nama biaya wajib diisi.').max(100),
  jenjang: z.enum(PMB_FEE_JENJANGS, { required_error: 'Jenjang wajib dipilih.' }),
  pmb_program_id: z.number({ required_error: 'Program wajib dipilih.' }).int().positive('Program wajib dipilih.'),
  amount: z
    .number({ invalid_type_error: 'Nominal wajib diisi.' })
    .int('Nominal harus bilangan bulat.')
    .min(1000, 'Nominal minimal Rp 1.000.')
    .max(100_000_000, 'Nominal terlalu besar.'),
  bank_name: z.string().trim().min(1, 'Bank transfer wajib diisi.').max(100),
  account_number: z.string().trim().min(1, 'Nomor rekening wajib diisi.').max(50),
  account_holder: z.string().trim().min(1, 'Atas nama rekening wajib diisi.').max(150),
  notes: z.string().max(255).optional().nullable(),
  is_active: z.boolean().optional(),
})

export type PmbFeeFormValues = z.infer<typeof pmbFeeFormSchema>

export function formatRupiah(amount: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`
}

export function parseRupiahInput(raw: string): number | null {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return null
  return Number(digits)
}

export function jenjangLabel(jenjang: string): string {
  if (jenjang === 'kb') return 'KB'
  if (jenjang === 'tk') return 'TK'
  if (jenjang === 'sd') return 'SD'
  return jenjang.toUpperCase()
}

export function programLabel(program: string, programName?: string | null): string {
  if (programName && programName.trim()) return programName
  if (program === 'icp') return 'ICP'
  if (program === 'reguler') return 'Reguler'
  return program
}

export function defaultFeeName(jenjang: string, programNameOrCode: string): string {
  return `${jenjangLabel(jenjang)} ${programLabel(programNameOrCode)}`
}
