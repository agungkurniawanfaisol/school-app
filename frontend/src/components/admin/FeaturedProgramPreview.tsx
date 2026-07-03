import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resolveProgramIcon } from '@/lib/lucide-icon-map'
import type { Curriculum } from '@/types'

interface FeaturedProgramPreviewProps {
  title: string
  excerpt?: string | null
  thumbnail?: string | null
  icon?: string | null
  category?: string | null
  isFeatured?: boolean
}

export function FeaturedProgramPreview({
  title,
  excerpt,
  thumbnail,
  icon,
  category,
  isFeatured = true,
}: FeaturedProgramPreviewProps) {
  const Icon = resolveProgramIcon(icon)
  const previewItem: Curriculum = {
    id: 0,
    school_id: 0,
    title: title || 'Judul program',
    slug: 'preview',
    excerpt: excerpt ?? null,
    icon: icon ?? null,
    thumbnail: thumbnail ?? null,
    category: category ?? null,
    order: 0,
    is_active: true,
    is_featured: isFeatured,
    created_at: null,
  }

  return (
    <div role="region" aria-live="polite" aria-label="Pratinjau program unggulan di beranda">
      <p className="mb-3 text-sm font-medium text-muted-foreground">Pratinjau Beranda</p>
      <Card className="card-hover overflow-hidden border-primary/10">
        {previewItem.thumbnail ? (
          <img
            src={previewItem.thumbnail}
            alt={previewItem.title}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-secondary/60">
            <Icon className="h-10 w-10 text-primary/40" aria-hidden />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug">{previewItem.title}</CardTitle>
            {previewItem.category && (
              <Badge variant="secondary" className="shrink-0 capitalize">
                {previewItem.category}
              </Badge>
            )}
          </div>
          {previewItem.excerpt && (
            <CardDescription className="line-clamp-2">{previewItem.excerpt}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">
            Kartu ini akan tampil di beranda jika status aktif dan &quot;Tampil di Beranda&quot; diaktifkan.
          </p>
          {previewItem.slug !== 'preview' && (
            <Link to={`/program/${previewItem.slug}`} className="sr-only">
              Lihat detail
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
