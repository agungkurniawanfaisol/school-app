import { Check } from 'lucide-react'
import {
  PMB_PIPELINE_STATUSES,
  PMB_STATUS_DESCRIPTIONS,
  PMB_STATUS_LABELS,
  resolvePipelineIndex,
} from '@/config/pmb-portal-nav'
import { cn } from '@/lib/utils'
import type { PmbEvent, PmbStatus } from '@/types'

interface PmbStatusTimelineProps {
  status: PmbStatus
  events?: PmbEvent[]
  compact?: boolean
  variant?: 'page' | 'sidebar'
  className?: string
}

type StepState = 'completed' | 'current' | 'upcoming' | 'rejected'

function stepState(index: number, currentIndex: number, isRejected: boolean): StepState {
  if (isRejected && index === PMB_PIPELINE_STATUSES.length - 1) return 'rejected'
  if (index < currentIndex) return 'completed'
  if (index === currentIndex) return 'current'
  return 'upcoming'
}

export function PmbStatusTimeline({
  status,
  events = [],
  compact = false,
  variant = 'page',
  className,
}: PmbStatusTimelineProps) {
  const isRejected = status === 'rejected'
  const currentIndex = resolvePipelineIndex(status)
  const stages = isRejected
    ? [...PMB_PIPELINE_STATUSES.slice(0, -1), 'rejected' as const]
    : [...PMB_PIPELINE_STATUSES]
  const isSidebar = variant === 'sidebar'
  const titleClass = isSidebar ? 'text-[var(--sidebar-text)]' : 'text-foreground'
  const mutedClass = isSidebar ? 'text-[var(--sidebar-muted)]' : 'text-muted-foreground'
  const borderClass = isSidebar ? 'border-[var(--sidebar-border)]' : 'border-border'

  return (
    <div className={cn('space-y-3', className)} aria-label="Timeline status pendaftaran">
      {!compact && (
        <p className={cn('font-medium', titleClass, 'text-sm')}>Proses pendaftaran</p>
      )}
      <ol className="space-y-2">
        {stages.map((stage, index) => {
          const state = stepState(index, currentIndex, isRejected)
          const label = PMB_STATUS_LABELS[stage] ?? stage

          return (
            <li key={stage} className="flex gap-2">
              <span
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium motion-reduce:transition-none',
                  state === 'completed' && 'bg-primary text-primary-foreground',
                  state === 'current' && 'border-2 border-primary bg-primary/10 text-primary',
                  state === 'upcoming' && cn('border', borderClass, mutedClass),
                  state === 'rejected' && 'bg-destructive text-destructive-foreground',
                )}
                aria-current={state === 'current' || state === 'rejected' ? 'step' : undefined}
              >
                {state === 'completed' ? <Check className="h-3.5 w-3.5" aria-hidden /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    compact ? 'text-xs' : 'text-sm',
                    state === 'current' || state === 'rejected'
                      ? cn('font-medium', titleClass)
                      : mutedClass,
                  )}
                >
                  {label}
                </p>
                {!compact && state === 'current' && PMB_STATUS_DESCRIPTIONS[stage] && (
                  <p className={cn('mt-0.5 text-xs', mutedClass)}>{PMB_STATUS_DESCRIPTIONS[stage]}</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
      {!compact && events.length > 0 && (
        <div className={cn('space-y-2 border-t pt-3', borderClass)}>
          <p className={cn('text-xs font-medium', mutedClass)}>Riwayat terbaru</p>
          {events.slice(-3).reverse().map((event) => (
            <div key={event.id ?? event.created_at} className={cn('text-xs', mutedClass)}>
              <p className={titleClass}>{event.message ?? event.type}</p>
              {event.created_at && (
                <p>{new Date(event.created_at).toLocaleString('id-ID')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
