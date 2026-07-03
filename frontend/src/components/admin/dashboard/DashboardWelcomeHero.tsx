import { CalendarDays, Plus, School, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface DashboardWelcomeHeroProps {
  userName: string
  pendingPmbCount?: number
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const quickLinks = [
  { label: 'Tambah Berita', href: '/admin/news/create', icon: Plus },
  { label: 'Carousel Beranda', href: '/admin/hero-sliders', icon: Sparkles },
  { label: 'Profil Sekolah', href: '/admin/vision-mission', icon: School },
] as const

export function DashboardWelcomeHero({ userName, pendingPmbCount = 0 }: DashboardWelcomeHeroProps) {
  const today = formatDate(new Date().toISOString(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-[#14532d]/40 shadow-lg"
      style={{
        backgroundColor: '#1a5f2a',
        backgroundImage: 'linear-gradient(135deg, #1a5f2a 0%, #2d7a3e 50%, #14532d 100%)',
      }}
      aria-label="Selamat datang"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, rgb(255 255 255 / 0.12) 0%, transparent 45%), radial-gradient(circle at 80% 20%, rgb(255 255 255 / 0.08) 0%, transparent 40%)',
        }}
        aria-hidden
      />
      <div className="relative p-5 text-white sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <Avatar className="h-14 w-14 shrink-0 border-2 border-white/30 shadow-lg">
              <AvatarFallback className="bg-white/20 text-lg font-bold text-white">
                {getUserInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/90">{getGreeting()}</p>
              <h1 className="mt-0.5 truncate text-2xl font-bold !text-white sm:text-3xl">{userName}</h1>
              <p className="mt-2 flex max-w-xl items-center gap-2 text-sm text-white/85">
                <CalendarDays className="h-4 w-4 shrink-0 text-white/85" aria-hidden />
                <span>{today}</span>
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
                Kelola konten website, profil sekolah, kursus, dan pendaftaran siswa baru dari satu tempat.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:min-w-[14rem] lg:flex-col xl:flex-row">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  asChild
                  variant="outline"
                  className="min-h-11 justify-start border-white/30 bg-white/10 text-white shadow-none hover:bg-white/20 hover:text-white"
                >
                  <Link to={item.href}>
                    <Icon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
            {pendingPmbCount > 0 && (
              <Button asChild className="min-h-11 border-0 bg-[#c9a227] font-semibold text-[#1a2e1f] hover:bg-[#d4b84a]">
                <Link to="/admin/pmb-registrations">
                  Review PMB
                  <Badge className="ml-2 border-0 bg-white/90 text-[#1a2e1f]">{pendingPmbCount}</Badge>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
