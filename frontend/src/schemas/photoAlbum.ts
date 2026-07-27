import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createAlbumPhotoSchema(t: AdminTFunction) {
  return z.object({
    url: z.string().min(1, t('validation.photoUrlRequired')).max(500),
    caption: z.string().max(300).optional().nullable(),
    order: z.number().int().min(0).default(0),
  })
}

export function createPhotoAlbumSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(200),
    slug: z.string().max(250).optional().nullable(),
    description: z.string().optional().nullable(),
    cover_image: z.string().max(500).optional().nullable(),
    event_date: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    photos: z.array(createAlbumPhotoSchema(t)).default([]),
  })
}

export const albumPhotoSchema = createAlbumPhotoSchema(defaultAdminT)
export const photoAlbumSchema = createPhotoAlbumSchema(defaultAdminT)

export type AlbumPhotoFormValues = z.infer<ReturnType<typeof createAlbumPhotoSchema>>
export type PhotoAlbumFormValues = z.infer<ReturnType<typeof createPhotoAlbumSchema>>
