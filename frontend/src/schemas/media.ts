import { z } from 'zod'

export const mediaSchema = z.object({
  filename: z.string().min(1).max(255),
  original_name: z.string().max(255).optional().nullable(),
  path: z.string().min(1).max(500),
  disk: z.string().max(50).default('public'),
  mime_type: z.string().max(100).optional().nullable(),
  size: z.number().int().min(0).optional().nullable(),
  collection: z.string().max(50).default('general'),
  meta: z.record(z.unknown()).optional().nullable(),
})

export type MediaFormValues = z.infer<typeof mediaSchema>
