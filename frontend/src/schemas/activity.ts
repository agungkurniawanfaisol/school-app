import { z } from 'zod'
import { editorDocumentSchema } from '@/schemas/editor'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export const activityPhotoSchema = z.object({
  id: z.number().int().optional(),
  path: z.string().min(1).max(500),
  caption: z.string().max(250).optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

const contentFields = {
  content: z.string().optional().nullable(),
  content_json: editorDocumentSchema.optional().nullable(),
}

function createActivityBaseSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
    slug: z.string().min(1).max(270),
    excerpt: z.string().max(500).optional().nullable(),
    thumbnail: z.string().max(500).optional().nullable(),
    category: z.string().max(100).optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    activity_date: z.string().optional().nullable(),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    published_at: z.string().optional().nullable(),
    photos: z.array(activityPhotoSchema).max(24).default([]),
    ...contentFields,
  })
}

export function createActivitySchema(t: AdminTFunction) {
  return createActivityBaseSchema(t).refine((data) => data.content || data.content_json, {
    message: t('validation.contentRequired'),
    path: ['content'],
  })
}

export function createActivityUpdateSchema(t: AdminTFunction) {
  return createActivityBaseSchema(t).partial().omit({ school_id: true })
}

export const activitySchema = createActivitySchema(defaultAdminT)
export const activityUpdateSchema = createActivityUpdateSchema(defaultAdminT)

export type ActivityPhotoFormValues = z.infer<typeof activityPhotoSchema>
export type ActivityFormValues = z.infer<ReturnType<typeof createActivitySchema>>
