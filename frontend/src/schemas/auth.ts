import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createLoginSchema(t: AdminTFunction) {
  return z.object({
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(1, t('validation.passwordRequired')),
  })
}

export const loginSchema = createLoginSchema(defaultAdminT)

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
