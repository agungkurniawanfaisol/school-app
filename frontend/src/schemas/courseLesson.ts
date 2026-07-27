import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createCourseLessonSchema(t: AdminTFunction) {
  return z.object({
    course_module_id: z.number().int().positive(t('validation.moduleRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
    slug: z.string().min(1).max(270),
    type: z.string().max(50).default('text'),
    content: z.string().optional().nullable(),
    video_url: z.string().max(500).optional().nullable(),
    duration_minutes: z.number().int().min(0).optional().nullable(),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
    is_free_preview: z.boolean().default(false),
  })
}

export const courseLessonSchema = createCourseLessonSchema(defaultAdminT)

export type CourseLessonFormValues = z.infer<ReturnType<typeof createCourseLessonSchema>>
