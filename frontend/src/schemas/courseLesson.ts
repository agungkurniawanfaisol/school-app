import { z } from 'zod'

export const courseLessonSchema = z.object({
  course_module_id: z.number().int().positive('Modul wajib dipilih'),
  title: z.string().min(1, 'Judul wajib diisi').max(250),
  slug: z.string().min(1).max(270),
  type: z.string().max(50).default('text'),
  content: z.string().optional().nullable(),
  video_url: z.string().max(500).optional().nullable(),
  duration_minutes: z.number().int().min(0).optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_free_preview: z.boolean().default(false),
})

export type CourseLessonFormValues = z.infer<typeof courseLessonSchema>
