import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createPmbEmailSendSchema(_t: AdminTFunction) {
  return z.object({
    registration_uuids: z.array(z.string().uuid()).min(1, 'Pilih minimal satu pendaftar.'),
    subject: z.string().trim().min(1, 'Subjek wajib diisi.').max(200, 'Subjek maksimal 200 karakter.'),
    body: z.string().trim().min(1, 'Isi email wajib diisi.').max(10000, 'Isi email maksimal 10.000 karakter.'),
  })
}

export function createPmbEmailBroadcastSchema(_t: AdminTFunction) {
  return z.object({
    status: z
      .enum(['all', 'draft', 'awaiting_verification', 'needs_revision', 'accepted', 'rejected'])
      .default('all'),
    subject: z.string().trim().min(1, 'Subjek wajib diisi.').max(200, 'Subjek maksimal 200 karakter.'),
    body: z.string().trim().min(1, 'Isi email wajib diisi.').max(10000, 'Isi email maksimal 10.000 karakter.'),
  })
}

export const pmbEmailSendSchema = createPmbEmailSendSchema(defaultAdminT)
export const pmbEmailBroadcastSchema = createPmbEmailBroadcastSchema(defaultAdminT)

export type PmbEmailSendFormValues = z.infer<ReturnType<typeof createPmbEmailSendSchema>>
export type PmbEmailBroadcastFormValues = z.infer<ReturnType<typeof createPmbEmailBroadcastSchema>>
