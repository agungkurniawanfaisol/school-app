import { Compass, GraduationCap, Home, Menu, Newspaper } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { MobileNavTree } from '@/components/layout/MobileNavTree'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSchool } from '@/hooks/useSchool'
import { cn } from '@/lib/utils'

type NavItem = {
  labelKey: string
  href: string
  icon: typeof Home
  matchPaths?: string[]
}

const navItems: NavItem[] = [
  { labelKey: 'nav.home', href: '/', icon: Home },
  { labelKey: 'nav.pmb', href: '/pmb', icon: GraduationCap, matchPaths: ['/pmb'] },
  { labelKey: 'nav.virtualTour', href: '/tur-virtual', icon: Compass },
  { labelKey: 'nav.news', href: '/berita', icon: Newspaper },
]

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === '/') return pathname === '/'
  if (item.matchPaths) {
    return item.matchPaths.some((p) => pathname.startsWith(p))
  }
  return pathname.startsWith(item.href)
}

export function BottomNav() {
  const { t } = useTranslation('layout')
  const { pathname } = useLocation()
  const { data: school } = useSchool()
  const [sheetOpen, setSheetOpen] = useState(false)

  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return null

  const isHome = pathname === '/'

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      aria-label={t('nav.mobileNav')}
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-black/[0.04] to-transparent dark:from-black/20"
          aria-hidden
        />

        <div
          className={cn(
            'relative border-t border-border/60 bg-background/80 backdrop-blur-2xl backdrop-saturate-[1.8]',
            'supports-[backdrop-filter]:bg-background/75',
            'dark:border-border/40 dark:bg-background/85',
          )}
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
            {navItems.map((item) => {
              const active = isItemActive(item, pathname)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'group relative flex min-h-[52px] min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 transition-colors',
                    'active:scale-[0.92] active:transition-transform active:duration-100',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="relative">
                    <Icon
                      className={cn(
                        'h-[22px] w-[22px] transition-all duration-200',
                        active ? 'stroke-[2.5]' : 'stroke-[1.75] group-hover:text-foreground/80',
                      )}
                    />
                    {active && (
                      <span
                        className="absolute -top-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-primary"
                        aria-hidden
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] leading-tight transition-colors duration-200',
                      active ? 'font-semibold' : 'font-medium group-hover:text-foreground/80',
                    )}
                  >
                    {t(item.labelKey)}
                  </span>
                </Link>
              )
            })}

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'group relative flex min-h-[52px] min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-muted-foreground transition-colors',
                    'active:scale-[0.92] active:transition-transform active:duration-100',
                    sheetOpen && 'text-primary',
                  )}
                >
                  <Menu
                    className={cn(
                      'h-[22px] w-[22px] stroke-[1.75] transition-all duration-200 group-hover:text-foreground/80',
                      sheetOpen && 'stroke-[2.5] text-primary',
                    )}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-medium leading-tight transition-colors duration-200 group-hover:text-foreground/80',
                      sheetOpen && 'font-semibold text-primary',
                    )}
                  >
                    {t('nav.more')}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="flex max-h-[85dvh] flex-col gap-0 rounded-t-2xl p-0"
              >
                <div className="flex items-center justify-center py-2" aria-hidden>
                  <div className="h-1 w-10 rounded-full bg-muted-foreground/25" />
                </div>

                <SheetHeader className="border-b border-border/60 px-5 pb-4">
                  <div className="flex items-center gap-3">
                    <SchoolLogo
                      logo={school?.logo}
                      alt={school?.name ?? 'Nurul Hikmah'}
                      variant="header"
                    />
                    <div className="min-w-0">
                      <SheetTitle className="truncate text-base font-bold">
                        {school?.name ?? 'Nurul Hikmah'}
                      </SheetTitle>
                      <p className="text-xs text-muted-foreground">
                        {t('nav.menuNav')}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-3 py-4">
                  <MobileNavTree
                    isHome={isHome}
                    onNavigate={() => setSheetOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div
            className="h-[env(safe-area-inset-bottom,0px)] bg-transparent"
            aria-hidden
          />
        </div>
      </div>
    </nav>
  )
}
