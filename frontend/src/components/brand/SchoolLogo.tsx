import { useState } from 'react'
import { getSchoolLogo, DEFAULT_SCHOOL_LOGO } from '@/lib/brand'
import { cn } from '@/lib/utils'

type SchoolLogoVariant = 'header' | 'footer' | 'about' | 'login' | 'sidebar'

const variantClasses: Record<SchoolLogoVariant, string> = {
  header: 'h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11',
  footer: 'h-11 w-11 rounded-full object-cover',
  about: 'max-h-56 w-auto max-w-[min(100%,16rem)] rounded-full object-contain',
  login: 'h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24',
  sidebar: 'h-8 w-8 rounded-full object-cover',
}

type SchoolLogoProps = {
  logo?: string | null
  alt: string
  variant?: SchoolLogoVariant
  className?: string
}

export function SchoolLogo({ logo, alt, variant = 'header', className }: SchoolLogoProps) {
  const [src, setSrc] = useState(() => getSchoolLogo(logo))

  return (
    <img
      src={src}
      alt={alt}
      data-testid="school-logo"
      className={cn(variantClasses[variant], className)}
      onError={() => {
        if (src !== DEFAULT_SCHOOL_LOGO) {
          setSrc(DEFAULT_SCHOOL_LOGO)
        }
      }}
    />
  )
}
