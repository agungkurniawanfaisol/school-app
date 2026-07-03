import { z } from 'zod'
import { editorDocumentSchema } from '@/schemas/editor'

const contentFields = {
  content: z.string().optional().nullable(),
  content_json: editorDocumentSchema.optional().nullable(),
}

const newsBaseSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  title: z.string().min(1, 'Judul wajib diisi').max(250),
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

export const newsSchema = newsBaseSchema.refine((data) => data.content || data.content_json, {
  message: 'Konten wajib diisi',
  path: ['content'],
})

export const newsUpdateSchema = newsBaseSchema.partial().omit({ school_id: true })

export type NewsFormValues = z.infer<typeof newsBaseSchema>
