import { z } from 'zod'

export const courseSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  title: z.string().min(1, 'Judul wajib diisi').max(250),
  slug: z.string().min(1).max(270),
  excerpt: z.string().max(500).optional().nullable(),
  description: z.string().optional().nullable(),
  thumbnail: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  level: z.string().max(50).optional().nullable(),
  duration_minutes: z.number().int().min(0).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
})

export type CourseFormValues = z.infer<typeof courseSchema>
