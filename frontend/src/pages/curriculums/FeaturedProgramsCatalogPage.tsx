import { useState } from 'react'
import { Search } from 'lucide-react'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { FeaturedProgramCard } from '@/components/landing/FeaturedProgramCard'
import { PageMeta } from '@/components/seo/PageMeta'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurriculumsList } from '@/hooks/useCurriculums'

export function FeaturedProgramsCatalogPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading, isFetching } = useCurriculumsList({
    per_page: 48,
    featured: true,
    search: search || undefined,
  })

  const programs = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title="Program Unggulan"
        description="Program pembelajaran unggulan Sekolah Islam Nurul Hikmah yang mengembangkan potensi akademik dan karakter Islami siswa."
      />
      <SubpageHero
        title="Program Pembelajaran Unggulan"
        subtitle="Program terintegrasi yang mengembangkan potensi akademik dan karakter Islami siswa."
        badge="Program Unggulan"
        backHref="/"
        backLabel="Kembali ke beranda"
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="relative mx-auto max-w-md">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari program..."
                  className="h-11 pl-9"
                  aria-label="Cari program unggulan"
                />
              </div>

              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl md:aspect-video" />
                  ))}
                </div>
              ) : programs.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  {search ? 'Tidak ada program ditemukan.' : 'Belum ada program unggulan.'}
                </p>
              ) : (
                <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
                  {programs.map((item) => (
                    <FeaturedProgramCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
    </PublicPageShell>
  )
}
