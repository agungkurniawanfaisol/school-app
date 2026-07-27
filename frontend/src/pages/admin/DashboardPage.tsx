import { Building2, GraduationCap, Newspaper, Sparkles, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DashboardFeedCard } from '@/components/admin/dashboard/DashboardFeedCard'
import { DashboardModuleGrid } from '@/components/admin/dashboard/DashboardModuleGrid'
import { DashboardStatCard } from '@/components/admin/dashboard/DashboardStatCard'
import { DashboardWelcomeHero } from '@/components/admin/dashboard/DashboardWelcomeHero'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { adminNavTree } from '@/config/admin-nav'
import { useAuthMe } from '@/hooks/useAuth'
import { useAdminActivitiesList } from '@/hooks/useActivities'
import { useAdminFacilitiesList } from '@/hooks/useFacilities'
import { useAdminCurriculumsList } from '@/hooks/useCurriculums'
import { useAdminNewsList } from '@/hooks/useNews'
import { useAdminPmbRegistrationsList } from '@/hooks/usePmb'
import { useAdminTeachersList } from '@/hooks/useTeachers'
import { formatDate } from '@/lib/utils'

const statCardKeys = [
  {
    key: 'news',
    labelKey: 'dashboard.stat.news',
    icon: Newspaper,
    href: '/admin/news',
    hintKey: 'dashboard.stat.newsHint',
  },
  {
    key: 'activities',
    labelKey: 'dashboard.stat.activities',
    icon: Zap,
    href: '/admin/student-activities',
    hintKey: 'dashboard.stat.activitiesHint',
  },
  {
    key: 'teachers',
    labelKey: 'dashboard.stat.teachers',
    icon: Users,
    href: '/admin/teachers',
    hintKey: 'dashboard.stat.teachersHint',
  },
  {
    key: 'facilities',
    labelKey: 'dashboard.stat.facilities',
    icon: Building2,
    href: '/admin/facilities',
    hintKey: 'dashboard.stat.facilitiesHint',
  },
  {
    key: 'curriculums',
    labelKey: 'dashboard.stat.programs',
    icon: Sparkles,
    href: '/admin/program-unggulan',
    hintKey: 'dashboard.stat.programsHint',
  },
  {
    key: 'pmb',
    labelKey: 'dashboard.stat.pmbPending',
    icon: GraduationCap,
    href: '/admin/pmb-registrations',
    hintKey: 'dashboard.stat.pmbPendingHint',
    highlight: true,
  },
] as const

export function DashboardPage() {
  const { t } = useTranslation('admin')
  const { data: user } = useAuthMe()
  const { data: newsData, isLoading: newsLoading } = useAdminNewsList({ per_page: 1 })
  const { data: activitiesData, isLoading: activitiesLoading } = useAdminActivitiesList({ per_page: 1 })
  const { data: teachersData, isLoading: teachersLoading } = useAdminTeachersList({ per_page: 1 })
  const { data: facilitiesData, isLoading: facilitiesLoading } = useAdminFacilitiesList({ per_page: 1 })
  const { data: curriculumsData, isLoading: curriculumsLoading } = useAdminCurriculumsList({ per_page: 1 })
  const { data: pmbData, isLoading: pmbLoading } = useAdminPmbRegistrationsList({ per_page: 1, status: 'pending' })
  const { data: recentNews, isLoading: recentLoading } = useAdminNewsList({ per_page: 5 })
  const { data: pendingPmb, isLoading: pendingPmbLoading } = useAdminPmbRegistrationsList({ per_page: 5, status: 'pending' })

  const counts: Record<string, number | undefined> = {
    news: newsData?.meta.total,
    activities: activitiesData?.meta.total,
    teachers: teachersData?.meta.total,
    facilities: facilitiesData?.meta.total,
    curriculums: curriculumsData?.meta.total,
    pmb: pmbData?.meta.total,
  }

  const loadingMap: Record<string, boolean> = {
    news: newsLoading,
    activities: activitiesLoading,
    teachers: teachersLoading,
    facilities: facilitiesLoading,
    curriculums: curriculumsLoading,
    pmb: pmbLoading,
  }

  return (
    <div className="space-y-6 admin-fade-in sm:space-y-8">
      <DashboardWelcomeHero
        userName={user?.name ?? t('common.administrator')}
        pendingPmbCount={pmbData?.meta.total ?? 0}
      />

      <section aria-labelledby="dashboard-stats-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="dashboard-stats-heading" className="text-lg font-semibold tracking-tight">
              {t('dashboard.contentSummary')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('dashboard.contentSummaryHint')}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-6">
          {statCardKeys.map((stat, index) => (
            <DashboardStatCard
              key={stat.key}
              label={t(stat.labelKey)}
              href={stat.href}
              icon={stat.icon}
              count={counts[stat.key]}
              isLoading={loadingMap[stat.key]}
              hint={t(stat.hintKey)}
              highlight={'highlight' in stat && stat.highlight}
              delayMs={index * 50}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-5 xl:gap-8">
        <section className="xl:col-span-3" aria-labelledby="dashboard-modules-heading">
          <div className="mb-4">
            <h2 id="dashboard-modules-heading" className="text-lg font-semibold tracking-tight">
              {t('dashboard.moduleAccess')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('dashboard.moduleAccessHint')}</p>
          </div>
          <DashboardModuleGrid groups={adminNavTree} />
        </section>

        <section className="space-y-6 xl:col-span-2" aria-labelledby="dashboard-activity-heading">
          <div>
            <h2 id="dashboard-activity-heading" className="text-lg font-semibold tracking-tight">
              {t('dashboard.recentActivity')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('dashboard.recentActivityHint')}</p>
          </div>

          <DashboardFeedCard
            title={t('dashboard.feed.latestNews')}
            viewAllHref="/admin/news"
            isLoading={recentLoading}
            isEmpty={!recentNews?.data.length}
            emptyIcon={Newspaper}
            emptyTitle={t('dashboard.empty.newsTitle')}
            emptyDescription={t('dashboard.empty.newsDesc')}
            emptyActionHref="/admin/news/create"
            emptyActionLabel={t('dashboard.empty.newsAction')}
          >
            {recentNews?.data.map((article) => (
              <Link
                key={article.id}
                to={`/admin/news/${article.uuid}/edit`}
                className="flex min-h-[3.25rem] items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{article.title}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {[article.category ?? t('dashboard.category.general'), article.published_at ? formatDate(article.published_at) : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <AdminStatusBadge status={article.status ?? 'draft'} />
              </Link>
            ))}
          </DashboardFeedCard>

          <DashboardFeedCard
            title={t('dashboard.feed.pmbReview')}
            viewAllHref="/admin/pmb-registrations"
            isLoading={pendingPmbLoading}
            isEmpty={!pendingPmb?.data.length}
            emptyIcon={GraduationCap}
            emptyTitle={t('dashboard.empty.pmbTitle')}
            emptyDescription={t('dashboard.empty.pmbDesc')}
            emptyActionHref="/admin/pmb-registrations"
            emptyActionLabel={t('dashboard.empty.pmbAction')}
          >
            {pendingPmb?.data.map((reg) => (
              <Link
                key={reg.id}
                to={`/admin/pmb-registrations/${reg.id}`}
                className="flex min-h-[3.25rem] items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{reg.student_name}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {[reg.registration_number, reg.grade_applied].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <AdminStatusBadge status={reg.status} />
              </Link>
            ))}
          </DashboardFeedCard>
        </section>
      </div>
    </div>
  )
}
