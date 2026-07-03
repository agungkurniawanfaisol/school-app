import { z } from 'zod'
import { editorDocumentSchema } from '@/schemas/editor'

export const facilityPhotoSchema = z.object({
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

const facilityBaseSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  name: z.string().min(1, 'Nama fasilitas wajib diisi').max(250),
  slug: z.string().min(1).max(270),
  description: z.string().max(1000).optional().nullable(),
  thumbnail: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  photos: z.array(facilityPhotoSchema).default([]),
  ...contentFields,
})

export const facilitySchema = facilityBaseSchema

export const facilityUpdateSchema = facilityBaseSchema.partial().omit({ school_id: true })

export type FacilityPhotoFormValues = z.infer<typeof facilityPhotoSchema>
export type FacilityFormValues = z.infer<typeof facilityBaseSchema>
