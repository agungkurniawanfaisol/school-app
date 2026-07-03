import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PublicCatalogPagination } from '@/components/content/PublicCatalogPagination'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useNewsList } from '@/hooks/useNews'
import { formatDate } from '@/lib/utils'

const PER_PAGE = 12

export function NewsCatalogPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useNewsList({
    page,
    per_page: PER_PAGE,
    search: search || undefined,
  })

  const items = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title="Berita & Artikel"
        description="Informasi terbaru seputar kegiatan dan prestasi Sekolah Islam Nurul Hikmah."
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2 text-center">
            <Button asChild variant="ghost" size="sm" className="mb-2 min-h-11">
              <Link to="/#berita">← Kembali ke beranda</Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Berita & Artikel</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Informasi terbaru seputar kegiatan dan prestasi sekolah.
            </p>
          </div>

          <div className="relative mx-auto max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Cari berita..."
              className="h-11 pl-9"
              aria-label="Cari berita"
            />
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {search ? 'Tidak ada berita yang cocok dengan pencarian.' : 'Belum ada berita.'}
            </p>
          ) : (
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/berita/detail/${item.uuid}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {item.category && (
                          <Badge variant="secondary" className="capitalize">
                            {item.category}
                          </Badge>
                        )}
                        {item.published_at && (
                          <span className="text-xs text-muted-foreground">{formatDate(item.published_at)}</span>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">
                        {item.title}
                      </CardTitle>
                      {item.excerpt && <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {data?.meta && (
            <PublicCatalogPagination
              page={page}
              lastPage={data.meta.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </PublicPageShell>
  )
}
