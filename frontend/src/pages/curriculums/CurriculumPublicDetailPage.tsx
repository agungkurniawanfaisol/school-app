import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import {
  ArticleDetailLayout,
  ArticleDetailSkeleton,
} from '@/components/content/ArticleDetailLayout'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurriculumDetail } from '@/hooks/useCurriculums'
import type { EditorDocument } from '@/schemas/editor'

export function CurriculumPublicDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: program, isLoading, isError } = useCurriculumDetail(slug ?? '')

  if (isLoading) {
    return (
      <PublicPageShell>
        <ArticleDetailSkeleton />
      </PublicPageShell>
    )
  }

  if (isError || !program) {
    return (
      <PublicPageShell>
        <div className="container-page section-padding text-center">
          <p className="text-muted-foreground">Program unggulan tidak ditemukan.</p>
          <Button asChild className="mt-4 min-h-11">
            <Link to="/program-unggulan">Kembali ke daftar program</Link>
          </Button>
        </div>
      </PublicPageShell>
    )
  }

  const hasRichContent = Boolean(program.content_json)
  const hasPlainContent = Boolean(program.content?.trim())

  return (
    <PublicPageShell>
      <PageMeta
        title={program.title}
        description={program.excerpt ?? `Program unggulan ${program.title} — Nurul Hikmah`}
      />
      <ArticleDetailLayout
        backHref="/program-unggulan"
        backLabel="Program Unggulan"
        title={program.title}
        excerpt={program.excerpt}
        thumbnail={program.thumbnail}
        category={program.category}
        readingSource={program.content ?? program.excerpt ?? ''}
        shareTitle={program.title}
        footer={
          program.is_featured ? (
            <Badge className="mt-2">Program Unggulan</Badge>
          ) : undefined
        }
      >
        {hasRichContent ? (
          <BlockRenderer document={program.content_json as EditorDocument} />
        ) : hasPlainContent ? (
          <div className="prose prose-neutral max-w-none whitespace-pre-line dark:prose-invert">
            {program.content}
          </div>
        ) : null}
      </ArticleDetailLayout>
    </PublicPageShell>
  )
}
