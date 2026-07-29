import { z } from 'zod'

export const pmbFeeFormSchema = z.object({
  school_id: z.number().int().positive(),
  academic_year_id: z.number().int().positive('Tahun ajaran wajib dipilih.'),
  amount: z
    .number({ invalid_type_error: 'Nominal wajib diisi.' })
    .int('Nominal harus bilangan bulat.')
    .min(1000, 'Nominal minimal Rp 1.000.')
    .max(100_000_000, 'Nominal terlalu besar.'),
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
