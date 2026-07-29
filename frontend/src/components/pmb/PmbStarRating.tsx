import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PmbStarRatingProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  className?: string
}

export function PmbStarRating({ value, onChange, disabled = false, className }: PmbStarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} role="radiogroup" aria-label="Rating testimoni">
      {Array.from({ length: 5 }).map((_, index) => {
        const rating = index + 1
        const active = rating <= value

        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} bintang`}
            disabled={disabled}
            onClick={() => onChange(rating)}
            className={cn(
              'rounded-md p-1 transition-colors motion-reduce:transition-none',
              disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-primary/10',
            )}
          >
            <Star
              className={cn(
                'size-8',
                active ? 'fill-[var(--gold-accent)] text-[var(--gold-accent)]' : 'text-muted-foreground/35',
              )}
              aria-hidden
            />
          </button>
        )
      })}
    </div>
  )
}
