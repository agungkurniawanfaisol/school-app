import { getSchoolLogo } from '@/lib/brand'
import { cn } from '@/lib/utils'

type SchoolLogoVariant = 'header' | 'footer' | 'about' | 'login' | 'sidebar'

const variantClasses: Record<SchoolLogoVariant, string> = {
  header: 'h-9 w-auto max-w-[9rem] object-contain sm:max-w-[11rem]',
  footer: 'h-10 w-auto max-w-[10rem] object-contain',
  about: 'w-full object-contain p-6 sm:p-8',
  login: 'mx-auto h-16 w-auto max-w-[18rem] object-contain',
  sidebar: 'h-8 w-auto max-w-[9rem] object-contain',
}

type SchoolLogoProps = {
  logo?: string | null
  alt: string
  variant?: SchoolLogoVariant
  className?: string
}

export function SchoolLogo({ logo, alt, variant = 'header', className }: SchoolLogoProps) {
  return (
    <img
      src={getSchoolLogo(logo)}
      alt={alt}
      className={cn(variantClasses[variant], className)}
    />
  )
}
