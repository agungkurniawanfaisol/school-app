import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme/ThemeProvider'
import type { Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Terang', icon: Sun },
  { value: 'dark', label: 'Gelap', icon: Moon },
  { value: 'system', label: 'Sistem', icon: Monitor },
]

interface ThemeToggleProps {
  className?: string
  variant?: 'ghost' | 'outline'
  /** Light text on hero overlay */
  onHero?: boolean
}

export function ThemeToggle({ className, variant = 'ghost', onHero = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const ActiveIcon = themeOptions.find((o) => o.value === theme)?.icon ?? Monitor

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="icon"
          className={cn(
            'h-11 w-11 shrink-0',
            onHero && 'border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20',
            className,
          )}
          aria-label="Ubah tema tampilan"
        >
          <ActiveIcon className="h-5 w-5" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} className="gap-2">
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
