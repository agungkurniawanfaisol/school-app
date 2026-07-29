import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FadeInView } from '@/components/motion/FadeInView'
import { FacilityCard } from '@/components/landing/FacilityCard'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useFacilitiesList } from '@/hooks/useFacilities'
import { cn } from '@/lib/utils'

/** Initial gallery page size (2×4 on large screens). API max per_page is 50. */
export const LANDING_FACILITY_PAGE_SIZE = 8
export const LANDING_FACILITY_MAX = 50

export function FacilitiesSection() {
  const { t } = useTranslation('landing')
  const [limit, setLimit] = useState(LANDING_FACILITY_PAGE_SIZE)
  const { data, isLoading, isFetching } = useFacilitiesList({
    per_page: limit,
  })
  const facilities = data?.data ?? []
  const total = data?.meta?.total ?? facilities.length
  const canRaiseLimit = limit < LANDING_FACILITY_MAX && total > facilities.length
  const showCatalogCta = total > facilities.length || total > LANDING_FACILITY_PAGE_SIZE

  return (
    <section id="fasilitas" className="section-padding pattern-bg">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge={t('facilities.badge')}
            title={t('facilities.title')}
            description={t('facilities.desc')}
            align="left"
            className="mb-0"
          />
          <Button asChild variant="outline" className="min-h-11 shrink-0 border-primary text-primary hover:bg-secondary">
            <Link to="/fasilitas">
              {t('facilities.viewAll')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('facilities.empty')}</p>
        ) : (
          <>
            <FadeInView direction="up" tier="full">
              <div
                className={cn(
                  'grid grid-cols-2 gap-4 lg:grid-cols-4',
                  isFetching && 'opacity-70',
                )}
                data-testid="facilities-gallery"
              >
                {facilities.map((facility) => (
                  <FacilityCard key={facility.id} facility={facility} />
                ))}
              </div>
            </FadeInView>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {canRaiseLimit && (
                <Button
                  type="button"
                  className="min-h-11 w-full shadow-md shadow-primary/20 sm:w-auto"
                  disabled={isFetching}
                  onClick={() =>
                    setLimit((prev) => Math.min(prev + LANDING_FACILITY_PAGE_SIZE, LANDING_FACILITY_MAX))
                  }
                >
                  {isFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : null}
                  {t('facilities.loadMore')}
                </Button>
              )}
              {showCatalogCta && (
                <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                  <Link to="/fasilitas">
                    {t('facilities.viewAllMobile')}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
