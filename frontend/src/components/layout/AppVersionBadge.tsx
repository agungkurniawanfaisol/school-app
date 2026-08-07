import { Link } from 'react-router-dom'
import { formatAppVersion, getBuildVersion } from '@/lib/app-version'
import { cn } from '@/lib/utils'

interface AppVersionBadgeProps {
  className?: string
  /** Visual variant for public footer vs admin sidebar */
  variant?: 'footer' | 'sidebar'
}

export function AppVersionBadge({ className, variant = 'footer' }: AppVersionBadgeProps) {
  const label = formatAppVersion(getBuildVersion())

  return (
    <Link
      to="/riwayat-versi"
      className={cn(
        'inline-flex min-h-11 items-center text-xs transition-colors',
        variant === 'footer' && 'text-white/60 hover:text-white',
        variant === 'sidebar' && 'text-[var(--sidebar-muted)] hover:text-[var(--sidebar-text)]',
        className,
      )}
      aria-label={`Versi aplikasi ${label}`}
    >
      {label}
    </Link>
  )
}
