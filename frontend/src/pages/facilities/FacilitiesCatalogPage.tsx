import { useState } from 'react'
import { Search } from 'lucide-react'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { FacilityCard } from '@/components/landing/FacilityCard'
import { PageMeta } from '@/components/seo/PageMeta'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useFacilitiesList } from '@/hooks/useFacilities'

export function FacilitiesCatalogPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading, isFetching } = useFacilitiesList({
    per_page: 48,
    search: search || undefined,
  })

  const facilities = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title="Fasilitas Sekolah"
        description="Sarana dan prasarana modern Sekolah Islam Nurul Hikmah untuk mendukung proses belajar mengajar yang optimal."
      />
      <SubpageHero
        title="Fasilitas Sekolah"
        subtitle="Sarana dan prasarana modern untuk mendukung proses belajar mengajar yang optimal."
        badge="Sarana Prasarana"
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
                  placeholder="Cari fasilitas..."
                  className="h-11 pl-9"
                  aria-label="Cari fasilitas"
                />
              </div>

              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
                  ))}
                </div>
              ) : facilities.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  {search ? 'Tidak ada fasilitas ditemukan.' : 'Belum ada data fasilitas.'}
                </p>
              ) : (
                <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
                  {facilities.map((facility) => (
                    <FacilityCard key={facility.id} facility={facility} />
                  ))}
                </div>
              )}
            </div>
          </div>
    </PublicPageShell>
  )
}
