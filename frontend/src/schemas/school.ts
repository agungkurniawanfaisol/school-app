import { z } from 'zod'

export const schoolSchema = z.object({
  name: z.string().min(1, 'Nama sekolah wajib diisi').max(200),
  slug: z.string().min(1).max(220),
  tagline: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  email: z.string().email('Email tidak valid').optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  whatsapp: z.string().max(30).optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(10).optional().nullable(),
  vision: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
})

export type SchoolFormValues = z.infer<typeof schoolSchema>
