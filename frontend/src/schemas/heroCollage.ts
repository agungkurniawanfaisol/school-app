import { z } from 'zod'

export const HERO_COLLAGE_COLORS = [
  'from-primary/30 to-primary/10',
  'from-primary/40 to-primary/10',
  'from-[var(--gold-accent)]/30 to-primary/10',
  'from-primary/25 to-accent/40',
  'from-accent/40 to-primary/15',
  'from-primary/50 to-primary/20',
] as const

export type HeroCollageColor = (typeof HERO_COLLAGE_COLORS)[number]

const heroCollageItemSchema = z.object({
  letter: z
    .string()
    .max(2, 'Huruf maksimal 2 karakter')
    .optional()
    .or(z.literal('')),
  label: z
    .string()
    .trim()
    .min(1, 'Label wajib diisi')
    .max(40, 'Label maksimal 40 karakter'),
  color: z.enum(HERO_COLLAGE_COLORS),
})

export const heroCollageSchema = z.object({
  subtitle: z
    .string()
    .trim()
    .min(1, 'Caption wajib diisi')
    .max(200, 'Caption maksimal 200 karakter'),
  items: z
    .array(heroCollageItemSchema)
    .length(4, 'Collage harus berisi tepat 4 item'),
})

export type HeroCollageFormValues = z.infer<typeof heroCollageSchema>
export type HeroCollageItem = z.infer<typeof heroCollageItemSchema>

export const DEFAULT_HERO_COLLAGE: HeroCollageFormValues = {
  subtitle: 'Lingkungan belajar yang hangat & inspiratif',
  items: [
    { letter: 'T', label: 'Tahfidz', color: 'from-primary/30 to-primary/10' },
    { letter: 'A', label: 'Akademik', color: 'from-primary/40 to-primary/10' },
    { letter: 'K', label: 'Karakter', color: 'from-[var(--gold-accent)]/30 to-primary/10' },
    { letter: 'K', label: 'Kegiatan', color: 'from-primary/25 to-accent/40' },
  ],
}

export function parseHeroCollageValue(raw: string | null | undefined): HeroCollageFormValues | null {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    const result = heroCollageSchema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function displayCollageLetter(item: Pick<HeroCollageItem, 'letter' | 'label'>): string {
  const letter = item.letter?.trim()
  if (letter) {
    return letter
  }
  return item.label.charAt(0) || '?'
}
