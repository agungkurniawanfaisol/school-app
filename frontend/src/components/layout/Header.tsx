import { Menu, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useSchool } from '@/hooks/useSchool'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/#tentang', label: 'Tentang' },
  { href: '/#kurikulum', label: 'Kurikulum' },
  { href: '/#guru', label: 'Guru' },
  { href: '/#kegiatan', label: 'Kegiatan' },
  { href: '/#fasilitas', label: 'Fasilitas' },
  { href: '/#berita', label: 'Berita' },
  { href: '/kursus', label: 'Kursus' },
  { href: '/pmb', label: 'PMB' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { data: school } = useSchool()

  const isHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
          {school?.logo ? (
            <img src={school.logo} alt={school.name} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
              NH
            </span>
          )}
          <span className="hidden text-sm sm:inline md:text-base">{school?.name ?? 'Nurul Hikmah'}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={isHome && link.href.startsWith('/#') ? link.href.replace('/', '') : link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {school?.whatsapp && (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href={`https://wa.me/${school.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                <Phone className="h-4 w-4" />
                Hubungi Kami
              </a>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={isHome && link.href.startsWith('/#') ? link.href.replace('/', '') : link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
