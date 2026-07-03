import { z } from 'zod'

export const testimonialSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  name: z.string().min(1, 'Nama wajib diisi').max(150),
  role: z.string().max(150).optional().nullable(),
  content: z.string().min(1, 'Isi testimoni wajib diisi'),
  photo: z.string().max(500).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>
