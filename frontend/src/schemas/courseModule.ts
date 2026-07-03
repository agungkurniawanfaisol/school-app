import { z } from 'zod'

export const courseModuleSchema = z.object({
  course_id: z.number().int().positive('Kursus wajib dipilih'),
  title: z.string().min(1, 'Judul wajib diisi').max(250),
  slug: z.string().min(1).max(270),
  description: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type CourseModuleFormValues = z.infer<typeof courseModuleSchema>
