import { cn } from '@/lib/utils'

interface IslamicPatternProps {
  className?: string
  opacity?: number
}

export function IslamicPattern({ className, opacity = 0.05 }: IslamicPatternProps) {
  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="islamic-star"
          x="0"
          y="0"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 4 L28 20 L44 20 L32 30 L36 46 L24 36 L12 46 L16 30 L4 20 L20 20 Z"
            fill="currentColor"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-star)" className="text-primary-foreground" />
    </svg>
  )
}
