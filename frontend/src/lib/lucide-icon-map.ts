import {
  BookOpen,
  BookOpenText,
  GraduationCap,
  Heart,
  Languages,
  type LucideIcon,
  Sparkles,
  Star,
  Target,
} from 'lucide-react'

export const PROGRAM_ICON_OPTIONS = [
  { value: 'book-open', label: 'Buku', icon: BookOpen },
  { value: 'book-open-text', label: 'Al-Qur\'an', icon: BookOpenText },
  { value: 'graduation-cap', label: 'Akademik', icon: GraduationCap },
  { value: 'heart', label: 'Karakter', icon: Heart },
  { value: 'languages', label: 'Bahasa', icon: Languages },
  { value: 'sparkles', label: 'Unggulan', icon: Sparkles },
  { value: 'star', label: 'Prestasi', icon: Star },
  { value: 'target', label: 'Fokus', icon: Target },
] as const

export type ProgramIconKey = (typeof PROGRAM_ICON_OPTIONS)[number]['value']

const ICON_MAP: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'book-open-text': BookOpenText,
  'book-quran': BookOpenText,
  'graduation-cap': GraduationCap,
  heart: Heart,
  languages: Languages,
  sparkles: Sparkles,
  star: Star,
  target: Target,
}

export function resolveProgramIcon(icon?: string | null): LucideIcon {
  if (!icon) return BookOpen
  return ICON_MAP[icon] ?? BookOpen
}
