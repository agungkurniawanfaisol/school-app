import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { displayIndonesiaPhone, normalizeIndonesiaPhoneDigits } from '@/lib/phone-id'
import { PMB_INPUT_TEXT } from '@/lib/pmb-portal-layout'
import { cn } from '@/lib/utils'

interface PmbPhoneInputProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  value?: string | null
  onChange: (value: string) => void
}

export const PmbPhoneInput = forwardRef<HTMLInputElement, PmbPhoneInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const digits = displayIndonesiaPhone(value)

    return (
      <div className={cn('flex', className)}>
        <span className="inline-flex h-11 min-w-[3.5rem] items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
          +62
        </span>
        <Input
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className={cn('rounded-l-none', PMB_INPUT_TEXT)}
          value={digits}
          onChange={(event) => onChange(normalizeIndonesiaPhoneDigits(event.target.value))}
          {...props}
        />
      </div>
    )
  },
)
PmbPhoneInput.displayName = 'PmbPhoneInput'
