import { z } from 'zod'

export const heroSliderSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  title: z.string().min(1, 'Judul wajib diisi').max(250),
  subtitle: z.string().max(500).optional().nullable(),
  image: z.string().min(1, 'Gambar wajib diisi').max(500),
  cta_text: z.string().max(100).optional().nullable(),
  cta_url: z.string().max(500).optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type HeroSliderFormValues = z.infer<typeof heroSliderSchema>
