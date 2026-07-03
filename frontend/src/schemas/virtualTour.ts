import { z } from 'zod'

export const virtualTourHotspotSchema = z.object({
  uuid: z.string().uuid().optional(),
  label: z.string().min(1, 'Label pin wajib diisi').max(150),
  pitch: z.number().min(-90).max(90),
  yaw: z.number().min(-180).max(180),
  order: z.number().int().min(0).optional(),
  target_scene_uuid: z.string().uuid('Pilih lokasi tujuan'),
})

export const virtualTourSceneSchema = z.object({
  uuid: z.string().uuid().optional(),
  title: z.string().min(1, 'Nama lokasi wajib diisi').max(250),
  image: z.string().min(1, 'Gambar panorama wajib diunggah').max(500),
  initial_pitch: z.number().min(-90).max(90).default(0),
  initial_yaw: z.number().min(-180).max(180).default(0),
  order: z.number().int().min(0).default(0),
  hotspots: z.array(virtualTourHotspotSchema).default([]),
})

export const virtualTourFormSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  title: z.string().min(1, 'Judul wajib diisi').max(250),
  slug: z.string().max(270).optional(),
  description: z.string().max(5000).optional().nullable(),
  is_active: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  start_scene_uuid: z.string().uuid().nullable().optional(),
  scenes: z.array(virtualTourSceneSchema).min(1, 'Minimal satu panorama'),
})

export type VirtualTourFormValues = z.infer<typeof virtualTourFormSchema>
