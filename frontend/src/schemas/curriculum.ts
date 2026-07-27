import { z } from 'zod'
import { editorDocumentSchema } from '@/schemas/editor'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

const contentFields = {
  content: z.string().optional().nullable(),
  content_json: editorDocumentSchema.optional().nullable(),
}

export function createFeaturedProgramSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
    slug: z.string().min(1).max(270),
    excerpt: z.string().max(500).optional().nullable(),
    icon: z.string().max(100).optional().nullable(),
    thumbnail: z.string().max(500).optional().nullable(),
    category: z.string().max(100).optional().nullable(),
    order: z.number().int().min(0),
    is_active: z.boolean(),
    is_featured: z.boolean(),
    ...contentFields,
  })
}

export const featuredProgramSchema = createFeaturedProgramSchema(defaultAdminT)

export type FeaturedProgramFormValues = z.infer<ReturnType<typeof createFeaturedProgramSchema>>

/** @deprecated Use featuredProgramSchema */
export const curriculumSchema = featuredProgramSchema

/** @deprecated Use FeaturedProgramFormValues */
export type CurriculumFormValues = FeaturedProgramFormValues
