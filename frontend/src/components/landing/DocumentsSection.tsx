import { Download, FileText, FileSpreadsheet, File } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FadeInView } from '@/components/motion/FadeInView'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useDocumentsList } from '@/hooks/useDocuments'
import type { Document } from '@/types'

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function getFileIcon(fileType: string | null) {
  switch (fileType?.toLowerCase()) {
    case 'pdf':
      return FileText
    case 'xls':
    case 'xlsx':
      return FileSpreadsheet
    default:
      return File
  }
}

function DocumentCard({ document }: { document: Document }) {
  const { t } = useTranslation('landing')
  const Icon = getFileIcon(document.file_type)

  return (
    <Card className="h-full border-primary/10 transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm leading-snug">{document.title}</CardTitle>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {document.file_type && (
                <span className="uppercase">{document.file_type}</span>
              )}
              {document.file_size && (
                <span>{formatFileSize(document.file_size)}</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {document.description && (
        <CardContent className="pt-0 pb-3">
          <CardDescription className="line-clamp-2">{document.description}</CardDescription>
        </CardContent>
      )}
      <CardContent className="pt-0">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full border-primary/20 text-primary hover:bg-primary/5"
        >
          <a href={document.file_url} download target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" aria-hidden />
            {t('documents.download')}
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

export function DocumentsSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading } = useDocumentsList({ per_page: 6 })
  const documents = data?.data ?? []

  return (
    <section id="dokumen" className="section-padding">
      <div className="container-page">
        <SectionHeader
          badge={t('documents.badge')}
          title={t('documents.title')}
          description={t('documents.desc')}
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('documents.empty')}</p>
        ) : (
          <FadeInView direction="up" tier="full">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          </FadeInView>
        )}
      </div>
    </section>
  )
}
