import { LogIn, Menu, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { MainNav } from '@/components/layout/MainNav'
import { MobileNavTree } from '@/components/layout/MobileNavTree'
import { ThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
            'relative z-10 flex shrink-0 items-center gap-2.5 font-semibold transition-opacity hover:opacity-90',
            isHeroOverlay ? 'text-primary-foreground' : 'text-primary',
          )}
        >
          <SchoolLogo
            logo={school?.logo}
            alt={school?.name ?? 'Nurul Hikmah'}
            variant="header"
            className={cn(isHeroOverlay && 'drop-shadow-md')}
          />
          <span className="font-heading text-lg font-bold tracking-tight">
            Nurul Hikmah
          </span>
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
            <SheetContent
              side="right"
              className="flex w-[min(100vw-1rem,340px)] flex-col gap-0 p-0"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 px-5 py-5">
                <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\'%3E%3Cpath d=\'M20 0L40 20L20 40L0 20Z\' fill=\'%23fff\' fill-opacity=\'0.4\'/%3E%3C/svg%3E")', backgroundSize: '40px 40px' }} aria-hidden />
                <SheetHeader className="relative z-10">
                  <div className="flex items-center gap-3">
                    <SchoolLogo
                      logo={school?.logo}
                      alt={school?.name ?? 'Nurul Hikmah'}
                      variant="header"
                      className="drop-shadow-lg"
                    />
                    <div className="min-w-0">
                      <SheetTitle className="truncate text-lg font-bold text-primary-foreground">
                        {school?.name ?? 'Nurul Hikmah'}
                      </SheetTitle>
                      <p className="text-xs text-primary-foreground/70">
                        Pesantren Modern
                      </p>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigasi mobile">
                <MobileNavTree isHome={isHome} onNavigate={() => setOpen(false)} />
              </nav>

              <div className="border-t border-border bg-muted/30 px-4 py-4">
                <div className="flex gap-2">
                  {school?.whatsapp && (
                    <Button asChild className="min-h-11 flex-1 gap-2 shadow-sm">
                      <a
                        href={`https://wa.me/${school.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className={cn(
                      'min-h-11 gap-2 border-primary/20',
                      school?.whatsapp ? 'w-auto' : 'flex-1',
                    )}
                  >
                    <Link to="/admin/login" onClick={() => setOpen(false)}>
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tema</span>
                  <ThemeToggle variant="outline" />
                </div>
              </div>
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
