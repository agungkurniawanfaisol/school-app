import { cn } from '@/lib/utils'

interface LandingSplashScreenProps {
  closing: boolean
  image: string
  title: string
  subtitle?: string
  preview?: boolean
}

export function LandingSplashScreen({
  closing,
  image,
  title,
  subtitle,
  preview = false,
}: LandingSplashScreenProps) {
  return (
    <div
      className={cn(
        preview
          ? 'relative flex min-h-[22rem] flex-col items-center justify-center gap-4 px-6 sm:gap-5'
          : 'fixed inset-0 z-50 flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 will-change-[opacity] sm:gap-5',
        !preview && closing && 'animate-splash-out',
      )}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <img
        src={image}
        alt=""
        className={cn(
          'h-28 w-28 object-contain will-change-transform sm:h-36 sm:w-36 lg:h-44 lg:w-44',
          closing ? 'animate-splash-zoom' : 'animate-splash-in',
        )}
      />
      <div
        className={cn(
          'max-w-xl space-y-2 text-center will-change-transform',
          closing ? 'animate-splash-zoom' : 'animate-splash-text-in',
        )}
      >
        <p className="text-xl font-bold text-primary sm:text-2xl lg:text-3xl">{title}</p>
        {subtitle ? (
          <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}
