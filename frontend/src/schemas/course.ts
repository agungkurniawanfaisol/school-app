import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createCourseSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
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
}

export const courseSchema = createCourseSchema(defaultAdminT)

export type CourseFormValues = z.infer<ReturnType<typeof createCourseSchema>>
