import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WIZARD_STEP_LABELS } from '@/schemas/pmb'

type StepStatus = 'completed' | 'current' | 'upcoming'

interface PmbWizardStepperProps {
  currentStep: number
  className?: string
  variant?: 'default' | 'sidebar'
  /** When set, steps are clickable (e.g. correction mode). */
  onStepSelect?: (index: number) => void
}

function stepStatus(index: number, current: number): StepStatus {
  if (index < current) return 'completed'
  if (index === current) return 'current'
  return 'upcoming'
}

export function PmbWizardStepper({
  currentStep,
  className,
  variant = 'default',
  onStepSelect,
}: PmbWizardStepperProps) {
  const isSidebar = variant === 'sidebar'
  const mutedClass = isSidebar ? 'text-[var(--sidebar-muted)]' : 'text-muted-foreground'
  const currentClass = isSidebar ? 'font-medium text-[var(--sidebar-text)]' : 'font-medium text-foreground'
  const safeStep = Math.max(0, Math.min(WIZARD_STEP_LABELS.length - 1, currentStep))
  const progress = ((safeStep + 1) / WIZARD_STEP_LABELS.length) * 100
  const selectable = Boolean(onStepSelect)

  const renderStepControl = (label: string, index: number, status: StepStatus, sizeClass: string) => {
    const classNameForStatus = cn(
      'flex items-center justify-center rounded-full text-sm font-medium transition-colors motion-reduce:transition-none',
      sizeClass,
      status === 'completed' && 'bg-primary text-primary-foreground shadow-sm shadow-primary/20',
      status === 'current' && 'border-2 border-primary bg-primary/10 text-primary ring-2 ring-primary/20',
      status === 'upcoming' && 'border border-border bg-muted text-muted-foreground',
      selectable && 'cursor-pointer hover:opacity-90 active:scale-95 motion-reduce:active:scale-100',
    )
    const content = status === 'completed' ? <Check className="h-4 w-4" aria-hidden /> : index + 1

    if (selectable) {
      return (
        <button
          type="button"
          className={classNameForStatus}
          aria-current={status === 'current' ? 'step' : undefined}
          aria-label={`Ke langkah ${label}`}
          onClick={() => onStepSelect?.(index)}
        >
          {content}
        </button>
      )
    }

    return (
      <span className={classNameForStatus} aria-current={status === 'current' ? 'step' : undefined}>
        {content}
      </span>
    )
  }

  if (isSidebar) {
    return (
      <nav aria-label="Langkah pendaftaran" className={cn('space-y-2', className)}>
        <p className={cn('text-xs', mutedClass)}>
          Langkah {safeStep + 1} dari {WIZARD_STEP_LABELS.length}
        </p>
        <p className={cn('text-sm', currentClass)}>{WIZARD_STEP_LABELS[safeStep]}</p>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-[rgb(255_255_255/0.12)]"
          role="progressbar"
          aria-valuenow={safeStep + 1}
          aria-valuemin={1}
          aria-valuemax={WIZARD_STEP_LABELS.length}
          aria-label="Progress formulir pendaftaran"
        >
          <div
            className="h-full rounded-full bg-[var(--sidebar-accent)] transition-[width] duration-200 motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>
    )
  }

  return (
    <nav aria-label="Langkah pendaftaran" className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <p className={cn('text-sm', mutedClass)}>
          Langkah {safeStep + 1} dari {WIZARD_STEP_LABELS.length}
        </p>
        <p className={cn('hidden truncate text-sm md:block', currentClass)}>
          {WIZARD_STEP_LABELS[safeStep]}
        </p>
      </div>

      <div className="relative -mx-1 md:hidden">
        <ol className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {WIZARD_STEP_LABELS.map((label, index) => {
            const status = stepStatus(index, safeStep)
            return (
              <li key={label} className="flex min-w-[4.5rem] shrink-0 snap-center flex-col items-center gap-1">
                {renderStepControl(label, index, status, 'size-11')}
                <span
                  className={cn(
                    'max-w-[4.75rem] truncate text-center text-[11px] leading-tight sm:text-xs',
                    status === 'current' ? 'font-medium text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <ol className="hidden items-start md:flex">
        {WIZARD_STEP_LABELS.map((label, index) => {
          const status = stepStatus(index, safeStep)
          const isLast = index === WIZARD_STEP_LABELS.length - 1
          return (
            <li key={label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {renderStepControl(label, index, status, 'relative z-10 size-11 shrink-0')}
                {!isLast && (
                  <div
                    className={cn(
                      'mx-1 h-0.5 flex-1 rounded-full transition-colors motion-reduce:transition-none',
                      index < safeStep ? 'bg-primary/60' : 'bg-border',
                    )}
                    aria-hidden
                  />
                )}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-center text-xs',
                  status === 'current' ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
