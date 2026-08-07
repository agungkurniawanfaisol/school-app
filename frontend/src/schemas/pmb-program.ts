import { z } from 'zod'

export const pmbProgramFormSchema = z.object({
  school_id: z.number().int().positive(),
  code: z
    .string()
    .trim()
    .min(1, 'Kode program wajib diisi.')
    .max(30, 'Kode maksimal 30 karakter.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Kode hanya huruf kecil, angka, dan tanda hubung.'),
  name: z.string().trim().min(1, 'Nama program wajib diisi.').max(100),
  sort_order: z.number().int().min(0).max(9999).optional(),
  is_active: z.boolean().optional(),
})

export const pmbProgramUpdateSchema = pmbProgramFormSchema.omit({ code: true }).extend({
  code: z.string().optional(),
})

export type PmbProgramFormValues = z.infer<typeof pmbProgramFormSchema>
