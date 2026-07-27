import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createCourseModuleSchema(t: AdminTFunction) {
  return z.object({
    course_id: z.number().int().positive(t('validation.courseRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
    slug: z.string().min(1).max(270),
    description: z.string().optional().nullable(),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
  })
}

export const courseModuleSchema = createCourseModuleSchema(defaultAdminT)

export type CourseModuleFormValues = z.infer<ReturnType<typeof createCourseModuleSchema>>
