import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

interface PmbFormFieldProps<T extends FieldValues, TName extends FieldPath<T>> {
  control: Control<T>
  name: TName
  label: string
  hint?: string
  leadingIcon?: LucideIcon
  className?: string
  children: (
    field: ControllerRenderProps<T, TName>,
    inputClassName?: string,
  ) => ReactNode
}

export function PmbFormField<T extends FieldValues, TName extends FieldPath<T>>({
  control,
  name,
  label,
  hint,
  leadingIcon: LeadingIcon,
  className,
  children,
}: PmbFormFieldProps<T, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          <FormControl>
            {LeadingIcon ? (
              <div className="relative">
                <LeadingIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                {children(field, 'pl-10 focus-visible:ring-primary/30')}
              </div>
            ) : (
              children(field, 'focus-visible:ring-primary/30')
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

/** Wrapper for non-FormField controls (Select, custom inputs) with consistent styling */
export function PmbFormFieldShell({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium leading-none">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}
