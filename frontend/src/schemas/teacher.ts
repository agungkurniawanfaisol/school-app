import { z } from 'zod'

export const teacherSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  name: z.string().min(1, 'Nama wajib diisi').max(200),
  slug: z.string().min(1).max(220),
  title: z.string().max(150).optional().nullable(),
  subject: z.string().max(150).optional().nullable(),
  bio: z.string().optional().nullable(),
  photo: z.string().max(500).optional().nullable(),
  email: z.string().email('Email tidak valid').optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
})

export type TeacherFormValues = z.infer<typeof teacherSchema>
