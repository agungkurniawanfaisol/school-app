import { z } from 'zod'

export const userRoleSchema = z.enum(['admin', 'guru'])

const userBaseSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(200),
  email: z.string().email('Email tidak valid').max(150),
  password: z.string().optional().or(z.literal('')),
  password_confirmation: z.string().optional().or(z.literal('')),
  role: userRoleSchema,
  is_active: z.boolean(),
  teacher_id: z.number().nullable().optional(),
})

function passwordMatchRefine(
  data: { password?: string; password_confirmation?: string },
  ctx: z.RefinementCtx,
  passwordRequired = false,
) {
  if (passwordRequired && !data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Kata sandi wajib diisi',
      path: ['password'],
    })
  }
  if (data.password && data.password.length > 0 && data.password.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Kata sandi minimal 8 karakter',
      path: ['password'],
    })
  }
  if (data.password && data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Konfirmasi kata sandi tidak cocok',
      path: ['password_confirmation'],
    })
  }
}

export const userFormSchema = userBaseSchema.superRefine((data, ctx) => {
  passwordMatchRefine(data, ctx, false)
})

export const createUserSchema = userBaseSchema
  .extend({
    password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
    password_confirmation: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .superRefine((data, ctx) => {
    passwordMatchRefine(data, ctx, true)
  })

export type UserFormValues = z.infer<typeof userBaseSchema>
export type CreateUserFormValues = z.infer<typeof createUserSchema>
