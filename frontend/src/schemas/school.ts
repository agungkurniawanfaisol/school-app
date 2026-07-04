import { z } from 'zod'

export const VISION_MAX_LENGTH = 1000
export const MISSION_MAX_LENGTH = 2000

export const visionMissionSchema = z.object({
  vision: z.string().max(VISION_MAX_LENGTH, `Visi maksimal ${VISION_MAX_LENGTH} karakter`).optional().nullable(),
  mission: z.string().max(MISSION_MAX_LENGTH, `Misi maksimal ${MISSION_MAX_LENGTH} karakter`).optional().nullable(),
})

export type VisionMissionFormValues = z.infer<typeof visionMissionSchema>

export const socialMediaSchema = z.object({
  facebook: z.string().max(500, 'Maksimal 500 karakter').optional().nullable(),
  instagram: z.string().max(500, 'Maksimal 500 karakter').optional().nullable(),
  youtube: z.string().max(500, 'Maksimal 500 karakter').optional().nullable(),
})

export type SocialMediaFormValues = z.infer<typeof socialMediaSchema>

export const schoolSchema = z.object({
  name: z.string().min(1, 'Nama sekolah wajib diisi').max(200),
  slug: z.string().min(1).max(220),
  tagline: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  email: z.string().email('Email tidak valid').optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  whatsapp: z.string().max(30).optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(10).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  map_embed_url: z.string().max(1000, 'URL embed maksimal 1000 karakter').optional().nullable(),
  social_media: socialMediaSchema.optional().nullable(),
  vision: z.string().max(VISION_MAX_LENGTH, `Visi maksimal ${VISION_MAX_LENGTH} karakter`).optional().nullable(),
  mission: z.string().max(MISSION_MAX_LENGTH, `Misi maksimal ${MISSION_MAX_LENGTH} karakter`).optional().nullable(),
  is_active: z.boolean().default(true),
})

export type SchoolFormValues = z.infer<typeof schoolSchema>
