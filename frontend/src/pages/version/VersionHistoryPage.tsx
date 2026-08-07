import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublicAppReleasesList } from '@/hooks/useAppReleases'
import { formatAppVersion } from '@/lib/app-version'

function formatDate(value: string | null, locale: string): string {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function VersionHistoryPage() {
  const { t, i18n } = useTranslation('pages')
  const { data, isLoading } = usePublicAppReleasesList({ per_page: 50 })
  const releases = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta title={t('versionHistory.title')} description={t('versionHistory.metaDesc')} />
      <SubpageHero
        title={t('versionHistory.title')}
        subtitle={t('versionHistory.subtitle')}
        backHref="/"
        backLabel={t('versionHistory.backHome')}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-3xl space-y-8">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          )}

          {!isLoading && releases.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">{t('versionHistory.empty')}</p>
          )}

          {!isLoading &&
            releases.map((release) => (
              <article
                key={release.uuid}
                className="border-b border-border/60 pb-8 last:border-0"
              >
                <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-heading text-lg font-semibold text-primary">
                    {formatAppVersion(release.version)}
                  </span>
                  <h2 className="text-base font-medium text-foreground">{release.title}</h2>
                  <time
                    dateTime={release.published_at ?? undefined}
                    className="text-xs text-muted-foreground"
                  >
                    {formatDate(release.published_at, i18n.language)}
                  </time>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {release.body}
                </div>
              </article>
            ))}
        </div>
      </div>
    </PublicPageShell>
  )
}
