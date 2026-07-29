import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const BRAND_GRADIENT = 'linear-gradient(135deg, #1a5f2a 0%, #2d7a3e 55%, #14532d 100%)'

interface PmbWizardShellProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  showBrandStrip?: boolean
}

export function PmbWizardShell({
  title,
  description,
  children,
  className,
  showBrandStrip = false,
}: PmbWizardShellProps) {
  return (
    <div className={cn('space-y-5', className)}>
      {showBrandStrip && (
        <div
          className="-mx-4 -mt-2 px-4 py-5 text-center sm:-mx-6 sm:px-6"
          style={{ background: BRAND_GRADIENT }}
        >
          <p className="text-sm font-medium text-white/90">{title}</p>
          {description && <p className="mt-1 text-xs text-white/75">{description}</p>}
        </div>
      )}
      {!showBrandStrip && (
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export { BRAND_GRADIENT }
