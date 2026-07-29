import type { LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatCapitalizeFirst, formatTitleCaseWords } from '@/lib/text-format'
import { PMB_INPUT_TEXT } from '@/lib/pmb-portal-layout'
import { cn } from '@/lib/utils'

type TextFormat = 'title' | 'sentence'

function applyFormat(value: string, format: TextFormat): string {
  return format === 'title' ? formatTitleCaseWords(value) : formatCapitalizeFirst(value)
}

type PmbTextInputProps = Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> & {
  value: string
  onChange: (value: string) => void
  format?: TextFormat
  leadingIcon?: LucideIcon
  hint?: string
}

export function PmbTextInput({
  value,
  onChange,
  format = 'sentence',
  leadingIcon: LeadingIcon,
  hint,
  className,
  ...props
}: PmbTextInputProps) {
  const input = (
    <Input
      className={cn(
        'h-11 focus-visible:ring-primary/30',
        PMB_INPUT_TEXT,
        LeadingIcon && 'pl-10',
        className,
      )}
      autoCapitalize={format === 'title' ? 'words' : 'sentences'}
      spellCheck={format === 'title'}
      {...props}
      value={value}
      onChange={(event) => onChange(applyFormat(event.target.value, format))}
    />
  )

  if (!LeadingIcon && !hint) return input

  return (
    <div className="space-y-1">
      {LeadingIcon ? (
        <div className="relative">
          <LeadingIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          {input}
        </div>
      ) : (
        input
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

type PmbTextareaProps = Omit<React.ComponentProps<typeof Textarea>, 'onChange' | 'value'> & {
  value: string
  onChange: (value: string) => void
  format?: TextFormat
  hint?: string
}

export function PmbTextarea({
  value,
  onChange,
  format = 'sentence',
  hint,
  className,
  ...props
}: PmbTextareaProps) {
  return (
    <div className="space-y-1">
      <Textarea
        className={cn('min-h-[5rem] focus-visible:ring-primary/30', PMB_INPUT_TEXT, className)}
        autoCapitalize={format === 'title' ? 'words' : 'sentences'}
        {...props}
        value={value}
        onChange={(event) => onChange(applyFormat(event.target.value, format))}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
