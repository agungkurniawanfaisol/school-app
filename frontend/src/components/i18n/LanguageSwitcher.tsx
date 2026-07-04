import { Globe, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage, type Locale } from '@/components/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

const LANGUAGES: { value: Locale; label: string; native: string }[] = [
  { value: 'id', label: 'Indonesia', native: 'Bahasa Indonesia' },
  { value: 'en', label: 'English', native: 'English' },
  { value: 'ar', label: 'Arabic', native: 'العربية' },
  { value: 'ja', label: 'Japanese', native: '日本語' },
]

export function LanguageSwitcher({ className, onHero = false }: { className?: string; onHero?: boolean }) {
  const { t } = useTranslation('layout')
  const { locale, isChangingLocale, setLocale } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-9 w-9',
            onHero && 'text-white hover:bg-white/20 hover:text-white',
            className,
          )}
          aria-label={t('nav.changeLang')}
        >
          {isChangingLocale
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Globe className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            disabled={isChangingLocale}
            onClick={() => setLocale(lang.value)}
            className={cn('gap-2', locale === lang.value && 'bg-accent font-medium')}
          >
            <span className="flex-1">{lang.native}</span>
            {locale === lang.value && <span className="text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
