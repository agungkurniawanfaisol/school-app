import { z } from 'zod'
import { isAllowedMapEmbedUrl, MAP_EMBED_URL_MAX, normalizeMapEmbedUrl } from '@/lib/google-maps-embed'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export const VISION_MAX_LENGTH = 1000
export const MISSION_MAX_LENGTH = 2000

export function createVisionMissionSchema(t: AdminTFunction) {
  return z.object({
    vision: z
      .string()
      .max(VISION_MAX_LENGTH, t('validation.maxLength', { max: VISION_MAX_LENGTH }))
      .optional()
      .nullable(),
    mission: z
      .string()
      .max(MISSION_MAX_LENGTH, t('validation.maxLength', { max: MISSION_MAX_LENGTH }))
      .optional()
      .nullable(),
    about_image: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().nullable(),
  })
}

export type VisionMissionFormValues = z.infer<ReturnType<typeof createVisionMissionSchema>>

export function createSocialMediaSchema(t: AdminTFunction) {
  return z.object({
    facebook: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().nullable(),
    instagram: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().nullable(),
    youtube: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().nullable(),
  })
}

export type SocialMediaFormValues = z.infer<ReturnType<typeof createSocialMediaSchema>>

export function createSchoolSchema(t: AdminTFunction) {
  return z.object({
    name: z.string().min(1, t('validation.schoolNameRequired')).max(200),
    slug: z.string().min(1).max(220),
    tagline: z.string().max(300).optional().nullable(),
    description: z.string().optional().nullable(),
    about_image: z.string().max(500).optional().nullable(),
    email: z.string().email(t('validation.emailInvalid')).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    whatsapp: z.string().max(30).optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().max(100).optional().nullable(),
    province: z.string().max(100).optional().nullable(),
    postal_code: z.string().max(10).optional().nullable(),
    latitude: z.number().min(-90).max(90).optional().nullable(),
    longitude: z.number().min(-180).max(180).optional().nullable(),
    map_embed_url: z.preprocess(
      (value) => normalizeMapEmbedUrl(typeof value === 'string' ? value : null),
      z
        .string()
        .max(MAP_EMBED_URL_MAX, t('validation.maxLength', { max: MAP_EMBED_URL_MAX }))
        .nullable()
        .optional()
        .refine(
          (value) => value == null || isAllowedMapEmbedUrl(value),
          { message: t('pages.schools.mapEmbedInvalid') },
        ),
    ),
    social_media: createSocialMediaSchema(t).optional().nullable(),
    vision: z
      .string()
      .max(VISION_MAX_LENGTH, t('validation.maxLength', { max: VISION_MAX_LENGTH }))
      .optional()
      .nullable(),
    mission: z
      .string()
      .max(MISSION_MAX_LENGTH, t('validation.maxLength', { max: MISSION_MAX_LENGTH }))
      .optional()
      .nullable(),
    is_active: z.boolean().default(true),
  })
}

export const visionMissionSchema = createVisionMissionSchema(defaultAdminT)
export const socialMediaSchema = createSocialMediaSchema(defaultAdminT)
export const schoolSchema = createSchoolSchema(defaultAdminT)

export type SchoolFormValues = z.infer<ReturnType<typeof createSchoolSchema>>
