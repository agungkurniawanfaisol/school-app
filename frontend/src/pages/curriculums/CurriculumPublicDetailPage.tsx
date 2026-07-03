import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurriculumDetail } from '@/hooks/useCurriculums'

export function CurriculumPublicDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: curriculum, isLoading, isError } = useCurriculumDetail(slug ?? '')

  if (isLoading) {
    return (
      <div className="container-page section-padding">
        <Skeleton className="mb-6 h-9 w-32" />
        <Skeleton className="mb-8 h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !curriculum) {
    return (
      <div className="container-page section-padding text-center">
        <p className="text-muted-foreground">Kurikulum tidak ditemukan.</p>
        <Button asChild className="mt-4">
          <Link to="/">Kembali ke beranda</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <PageMeta
        title={curriculum.title}
        description={curriculum.excerpt ?? `Kurikulum ${curriculum.title} — Nurul Hikmah`}
      />
      <article className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">← Beranda</Link>
          </Button>
          <div className="flex flex-wrap gap-2">
            {curriculum.category && <Badge variant="secondary">{curriculum.category}</Badge>}
            {curriculum.is_featured && <Badge>Unggulan</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{curriculum.title}</h1>
          {curriculum.thumbnail && (
            <img
              src={curriculum.thumbnail}
              alt={curriculum.title}
              className="aspect-video w-full rounded-xl object-cover"
            />
          )}
          {curriculum.excerpt && (
            <p className="text-lg text-muted-foreground">{curriculum.excerpt}</p>
          )}
          {curriculum.content && (
            <div className="prose prose-neutral max-w-none dark:prose-invert">{curriculum.content}</div>
          )}
        </div>
      </article>
    </>
  )
}
