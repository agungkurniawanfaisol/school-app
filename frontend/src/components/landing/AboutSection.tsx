import { HandHeart, Heart, Sparkles, Target } from 'lucide-react'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useSchool } from '@/hooks/useSchool'
import { cn } from '@/lib/utils'

const values = [
  { icon: Heart, title: 'Akhlak', desc: 'Membentuk karakter mulia', color: 'hover:border-rose-300/50' },
  { icon: Sparkles, title: 'Ilmu', desc: 'Pembelajaran berkualitas', color: 'hover:border-amber-300/50' },
  { icon: HandHeart, title: 'Amal', desc: 'Peduli sesama & lingkungan', color: 'hover:border-emerald-300/50' },
  { icon: Target, title: 'Ukhuwah', desc: 'Persaudaraan Islami', color: 'hover:border-primary/40' },
]

export function AboutSection() {
  const { data: school, isLoading } = useSchool()

  if (isLoading) {
    return (
      <section id="tentang" className="section-padding pattern-bg pattern-islamic">
        <div className="container-page space-y-6">
          <Skeleton className="skeleton-shimmer mx-auto h-8 w-48 rounded-lg" />
          <Skeleton className="skeleton-shimmer h-64 w-full rounded-2xl" />
        </div>
      </section>
    )
  }

  return (
    <section id="tentang" className="landing-section section-padding pattern-bg pattern-islamic">
      <div className="container-page">
        <SectionHeader
          badge="Tentang Kami"
          title="Mengenal Nurul Hikmah Lebih Dekat"
          description={
            school?.description ??
            'Kami berkomitmen memberikan pendidikan terbaik dengan landasan nilai-nilai Islami.'
          }
        />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <RevealOnScroll direction="left">
            <div className="group relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 to-[var(--gold-accent)]/10 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden />
              <div className="relative overflow-hidden rounded-2xl border-2 border-primary/15 bg-secondary/40 shadow-lg shadow-primary/5">
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-secondary to-accent/50 transition-transform duration-500 group-hover:scale-[1.02]">
                  <SchoolLogo
                    logo={school?.logo}
                    alt={school?.name ?? 'Nurul Hikmah'}
                    variant="about"
                  />
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <div className="space-y-6">
            {school?.vision && (
              <RevealOnScroll direction="right" delay={100}>
                <Card className="card-hover border-primary/10 bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Target className="h-5 w-5 text-[var(--gold-accent)]" />
                      Visi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">{school.vision}</p>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            )}
            {school?.mission && (
              <RevealOnScroll direction="right" delay={200}>
                <Card className="card-hover border-primary/10 bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">Misi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                      {school.mission}
                    </p>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            )}
          </div>
        </div>

        <RevealOnScroll direction="up" delay={150}>
          <div className="mt-14">
            <h3 className="mb-8 text-center text-xl font-bold text-primary">Nilai-nilai Kami</h3>
            <StaggerChildren className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {values.map(({ icon: Icon, title, desc, color }) => (
                <StaggerItem key={title}>
                  <div
                    className={cn(
                      'card-hover flex h-full flex-col items-center rounded-2xl border border-primary/10 bg-card p-5 text-center',
                      color,
                    )}
                  >
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
