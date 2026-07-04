import { z } from 'zod'

export const albumPhotoSchema = z.object({
    url: z.string().min(1, 'URL foto wajib diisi').max(500),
    caption: z.string().max(300).optional().nullable(),
    order: z.number().int().min(0).default(0),
})

export const photoAlbumSchema = z.object({
    school_id: z.number().int().positive('Sekolah wajib dipilih'),
    title: z.string().min(1, 'Judul wajib diisi').max(200),
    slug: z.string().max(250).optional().nullable(),
    description: z.string().optional().nullable(),
    cover_image: z.string().max(500).optional().nullable(),
    event_date: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    photos: z.array(albumPhotoSchema).default([]),
})

export type AlbumPhotoFormValues = z.infer<typeof albumPhotoSchema>
export type PhotoAlbumFormValues = z.infer<typeof photoAlbumSchema>
