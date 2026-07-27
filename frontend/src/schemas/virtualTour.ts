import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createVirtualTourHotspotSchema(t: AdminTFunction) {
  return z.object({
    uuid: z.string().uuid().optional(),
    label: z.string().min(1, t('validation.pinLabelRequired')).max(150),
    pitch: z.number().min(-90).max(90),
    yaw: z.number().min(-180).max(180),
    order: z.number().int().min(0).optional(),
    target_scene_uuid: z.string().uuid(t('validation.targetSceneRequired')),
  })
}

export function createVirtualTourSceneSchema(t: AdminTFunction) {
  return z.object({
    uuid: z.string().uuid().optional(),
    title: z.string().min(1, t('validation.locationNameRequired')).max(250),
    image: z.string().min(1, t('validation.panoramaRequired')).max(500),
    initial_pitch: z.number().min(-90).max(90).default(0),
    initial_yaw: z.number().min(-180).max(180).default(0),
    order: z.number().int().min(0).default(0),
    hotspots: z.array(createVirtualTourHotspotSchema(t)).default([]),
  })
}

export function createVirtualTourFormSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
    slug: z.string().max(270).optional(),
    description: z.string().max(5000).optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    start_scene_uuid: z.string().uuid().nullable().optional(),
    scenes: z.array(createVirtualTourSceneSchema(t)).min(1, t('validation.minOnePanorama')),
  })
}

export const virtualTourHotspotSchema = createVirtualTourHotspotSchema(defaultAdminT)
export const virtualTourSceneSchema = createVirtualTourSceneSchema(defaultAdminT)
export const virtualTourFormSchema = createVirtualTourFormSchema(defaultAdminT)

export type VirtualTourFormValues = z.infer<ReturnType<typeof createVirtualTourFormSchema>>
