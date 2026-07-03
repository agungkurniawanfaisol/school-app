import { z } from 'zod'

export const profileAccountSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi').max(200),
    email: z.string().email('Email tidak valid').max(150),
    password: z.string().optional().or(z.literal('')),
    password_confirmation: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
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
  })

export const profileTeacherSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(200),
  title: z.string().max(150).optional().or(z.literal('')),
  subject: z.string().max(150).optional().or(z.literal('')),
  bio: z.string().optional().or(z.literal('')),
  photo: z.string().max(500).optional().or(z.literal('')),
  email: z.string().max(150).optional().or(z.literal('')).refine(
    (val) => !val || z.string().email().safeParse(val).success,
    'Email tidak valid',
  ),
})

export type ProfileAccountValues = z.infer<typeof profileAccountSchema>
export type ProfileTeacherValues = z.infer<typeof profileTeacherSchema>
