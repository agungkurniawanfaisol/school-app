import { z } from 'zod'

export const settingSchema = z.object({
  school_id: z.number().int().positive().optional().nullable(),
  group: z.string().min(1, 'Grup wajib diisi').max(50),
  key: z.string().min(1, 'Kunci wajib diisi').max(100),
  value: z.string().optional().nullable(),
  type: z.enum(['string', 'integer', 'boolean', 'json']).default('string'),
})

export type SettingFormValues = z.infer<typeof settingSchema>
