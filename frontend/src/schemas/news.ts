import { z } from 'zod'
import { editorDocumentSchema } from '@/schemas/editor'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

const contentFields = {
  content: z.string().optional().nullable(),
  content_json: editorDocumentSchema.optional().nullable(),
}

export function createNewsSchema(t: AdminTFunction) {
  const newsBaseSchema = z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
    slug: z.string().min(1).max(270),
    excerpt: z.string().max(500).optional().nullable(),
    thumbnail: z.string().max(500).optional().nullable(),
    category: z.string().max(100).optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    published_at: z.string().optional().nullable(),
    publish_ends_at: z.string().optional().nullable(),
    ...contentFields,
  })

  return newsBaseSchema.refine((data) => data.content || data.content_json, {
    message: t('validation.contentRequired'),
    path: ['content'],
  })
}

export function createNewsUpdateSchema(t: AdminTFunction) {
  const base = z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
    slug: z.string().min(1).max(270),
    excerpt: z.string().max(500).optional().nullable(),
    thumbnail: z.string().max(500).optional().nullable(),
    category: z.string().max(100).optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    published_at: z.string().optional().nullable(),
    publish_ends_at: z.string().optional().nullable(),
    ...contentFields,
  })

  return base.partial().omit({ school_id: true })
}

export const newsSchema = createNewsSchema(defaultAdminT)
export const newsUpdateSchema = createNewsUpdateSchema(defaultAdminT)

export type NewsFormValues = z.infer<ReturnType<typeof createNewsSchema>>
