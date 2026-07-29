import { z } from 'zod'

export const academicYearLabelSchema = z
  .string()
  .trim()
  .regex(/^\d{4}\/\d{4}$/, 'Format tahun ajaran harus YYYY/YYYY (contoh: 2026/2027).')
  .refine((value) => {
    const match = value.match(/^(\d{4})\/(\d{4})$/)
    if (!match) return false
    return Number(match[2]) === Number(match[1]) + 1
  }, 'Tahun kedua harus tahun pertama + 1.')

export const academicYearFormSchema = z.object({
  school_id: z.coerce.number().int().positive('Sekolah wajib dipilih.'),
  label: academicYearLabelSchema,
  is_active: z.boolean().default(false),
})

export type AcademicYearFormValues = z.infer<typeof academicYearFormSchema>
