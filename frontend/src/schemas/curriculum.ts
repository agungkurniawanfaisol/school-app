import { z } from 'zod'
import { editorDocumentSchema } from '@/schemas/editor'

const contentFields = {
  content: z.string().optional().nullable(),
  content_json: editorDocumentSchema.optional().nullable(),
}

export const featuredProgramSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  title: z.string().min(1, 'Judul wajib diisi').max(250),
  slug: z.string().min(1).max(270),
  excerpt: z.string().max(500).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
  thumbnail: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(true),
  ...contentFields,
})

export type FeaturedProgramFormValues = z.infer<typeof featuredProgramSchema>

/** @deprecated Use featuredProgramSchema */
export const curriculumSchema = featuredProgramSchema

/** @deprecated Use FeaturedProgramFormValues */
export type CurriculumFormValues = FeaturedProgramFormValues
