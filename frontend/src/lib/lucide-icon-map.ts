import {
  BookOpen,
  BookOpenText,
  GraduationCap,
  HandHeart,
  Heart,
  Languages,
  type LucideIcon,
  Sparkles,
  Star,
  Target,
  Users,
} from 'lucide-react'

export const PROGRAM_ICON_OPTIONS = [
  { value: 'book-open', label: 'Buku', icon: BookOpen },
  { value: 'book-open-text', label: "Al-Qur'an", icon: BookOpenText },
  { value: 'graduation-cap', label: 'Akademik', icon: GraduationCap },
  { value: 'users', label: 'Siswa', icon: Users },
  { value: 'heart', label: 'Karakter', icon: Heart },
  { value: 'hand-heart', label: 'Kepedulian', icon: HandHeart },
  { value: 'languages', label: 'Bahasa', icon: Languages },
  { value: 'sparkles', label: 'Unggulan', icon: Sparkles },
  { value: 'star', label: 'Prestasi', icon: Star },
  { value: 'target', label: 'Fokus', icon: Target },
] as const

export type ProgramIconKey = (typeof PROGRAM_ICON_OPTIONS)[number]['value']

/** Alias for school values — same Lucide allowlist as program unggulan. */
export const VALUE_ICON_OPTIONS = PROGRAM_ICON_OPTIONS

export type ValueIconKey = ProgramIconKey

const ICON_MAP: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'book-open-text': BookOpenText,
  'book-quran': BookOpenText,
  'graduation-cap': GraduationCap,
  users: Users,
  heart: Heart,
  'hand-heart': HandHeart,
  languages: Languages,
  sparkles: Sparkles,
  star: Star,
  target: Target,
}

export function resolveProgramIcon(icon?: string | null): LucideIcon {
  if (!icon) return BookOpen
  return ICON_MAP[icon] ?? BookOpen
}

export function resolveValueIcon(icon?: string | null): LucideIcon {
  if (!icon) return Heart
  return ICON_MAP[icon] ?? Heart
}
