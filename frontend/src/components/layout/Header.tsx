import { LogIn, Menu, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { MainNav } from '@/components/layout/MainNav'
import { MobileNavTree } from '@/components/layout/MobileNavTree'
import { ThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useSchool } from '@/hooks/useSchool'
import { cn } from '@/lib/utils'

const SCROLL_THRESHOLD = 32

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { data: school } = useSchool()

  const isHome = location.pathname === '/'
  const isHeroOverlay = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
      setScrolled(scrollTop > SCROLL_THRESHOLD)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-40 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out',
        isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0',
        isHeroOverlay
          ? 'border-transparent bg-gradient-to-b from-primary/35 via-primary/15 to-transparent backdrop-blur-[2px]'
          : scrolled
            ? 'border-primary/15 bg-background/90 shadow-md shadow-primary/5 backdrop-blur-lg'
            : 'border-primary/10 bg-background/80 backdrop-blur-md',
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Lewati ke konten
      </a>

      <div className="container-page relative flex h-16 items-center lg:h-[4.25rem]">
        <Link
          to="/"
          className={cn(
            'relative z-10 flex shrink-0 items-center font-semibold transition-opacity hover:opacity-90',
            isHeroOverlay ? 'text-primary-foreground' : 'text-primary',
          )}
        >
          <SchoolLogo
            logo={school?.logo}
            alt={school?.name ?? 'Nurul Hikmah'}
            variant="header"
            className={cn(isHeroOverlay && 'drop-shadow-md')}
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 hidden justify-center lg:flex">
          <div className="pointer-events-auto">
            <MainNav isHome={isHome} isHeroOverlay={isHeroOverlay} />
          </div>
        </div>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle variant="ghost" onHero={isHeroOverlay} />
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(
              'hidden sm:inline-flex',
              isHeroOverlay
                ? 'border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground'
                : 'border-primary/25 text-primary',
            )}
          >
            <Link to="/admin/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
          {school?.whatsapp && (
            <Button
              asChild
              size="sm"
              className={cn(
                'hidden shadow-md sm:inline-flex',
                isHeroOverlay
                  ? 'bg-primary-foreground text-primary shadow-primary-foreground/20 hover:bg-primary-foreground/90'
                  : 'shadow-primary/20',
              )}
            >
              <a
                href={`https://wa.me/${school.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
              >
                <Phone className="h-4 w-4" />
                Hubungi Kami
              </a>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'h-11 w-11 lg:hidden',
                  isHeroOverlay
                    ? 'border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20'
                    : 'border-primary/20',
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
              <SheetHeader>
                <SheetTitle className="text-primary">{school?.name ?? 'Menu'}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4" aria-label="Navigasi mobile">
                <MobileNavTree isHome={isHome} onNavigate={() => setOpen(false)} />
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  <Button asChild variant="outline" className="min-h-11 w-full">
                    <Link to="/admin/login" onClick={() => setOpen(false)}>
                      <LogIn className="h-4 w-4" />
                      Login Admin
                    </Link>
                  </Button>
                  {school?.whatsapp && (
                    <Button asChild variant="outline" className="min-h-11 w-full">
                      <a
                        href={`https://wa.me/${school.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div
        className={cn(
          'h-0.5',
          isHeroOverlay ? 'bg-primary-foreground/15' : 'bg-primary/10',
        )}
        role="presentation"
        aria-hidden
      >
        <div
          className={cn(
            'h-full transition-[width] duration-150 ease-out',
            isHeroOverlay ? 'bg-[var(--gold-accent)]' : 'bg-primary',
          )}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  )
}
