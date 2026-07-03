import { z } from 'zod'

export const facilitySchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  name: z.string().min(1, 'Nama fasilitas wajib diisi').max(200),
  slug: z.string().min(1).max(220),
  description: z.string().optional().nullable(),
  thumbnail: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
})

export type FacilityFormValues = z.infer<typeof facilitySchema>
