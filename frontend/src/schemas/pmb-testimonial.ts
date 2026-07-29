import { z } from 'zod'

export const pmbTestimonialSchema = z.object({
  content: z
    .string()
    .trim()
    .min(10, 'Testimoni minimal 10 karakter.')
    .max(2000, 'Testimoni maksimal 2000 karakter.'),
  rating: z
    .number({ required_error: 'Rating wajib dipilih.' })
    .int()
    .min(1, 'Rating minimal 1 bintang.')
    .max(5, 'Rating maksimal 5 bintang.'),
  photo_media_id: z.number().int().positive().optional().nullable(),
  role: z.string().trim().max(150).optional().nullable(),
})

export type PmbTestimonialFormValues = z.infer<typeof pmbTestimonialSchema>

export interface PortalTestimonial {
  id: number
  school_id: number
  name: string
  role: string | null
  content: string
  photo: string | null
  rating: number | null
  is_active: boolean
  status: 'pending' | 'published'
  created_at: string | null
  updated_at: string | null
}
