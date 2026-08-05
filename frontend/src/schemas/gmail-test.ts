import { z } from 'zod'

export const gmailTestSendSchema = z.object({
  to: z
    .string()
    .trim()
    .min(1, 'Alamat email wajib diisi.')
    .email('Alamat email tidak valid.')
    .max(255, 'Alamat email maksimal 255 karakter.'),
  subject: z.string().trim().min(1, 'Subjek wajib diisi.').max(200, 'Subjek maksimal 200 karakter.'),
  body: z.string().trim().min(1, 'Isi email wajib diisi.').max(10000, 'Isi email maksimal 10.000 karakter.'),
})

export type GmailTestSendFormValues = z.infer<typeof gmailTestSendSchema>
