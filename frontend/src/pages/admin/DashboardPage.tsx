import { BookOpen, Building2, GraduationCap, Newspaper, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { adminNavTree } from '@/config/admin-nav'
import { useAuthMe } from '@/hooks/useAuth'
import { useAdminFacilitiesList } from '@/hooks/useFacilities'
import { useAdminCurriculumsList } from '@/hooks/useCurriculums'
import { useAdminNewsList } from '@/hooks/useNews'
import { useAdminPmbRegistrationsList } from '@/hooks/usePmb'
import { useAdminTeachersList } from '@/hooks/useTeachers'

const statCards = [
  { key: 'news', label: 'Berita', icon: Newspaper, href: '/admin/news', gold: false },
  { key: 'teachers', label: 'Guru', icon: Users, href: '/admin/teachers', gold: false },
  { key: 'facilities', label: 'Fasilitas', icon: Building2, href: '/admin/facilities', gold: false },
  { key: 'curriculums', label: 'Kurikulum', icon: BookOpen, href: '/admin/curriculums', gold: false },
  { key: 'pmb', label: 'PMB Pending', icon: GraduationCap, href: '/admin/pmb-registrations', gold: true },
] as const

export function DashboardPage() {
  const { data: user } = useAuthMe()
  const { data: newsData, isLoading: newsLoading } = useAdminNewsList({ per_page: 1 })
  const { data: teachersData, isLoading: teachersLoading } = useAdminTeachersList({ per_page: 1 })
  const { data: facilitiesData, isLoading: facilitiesLoading } = useAdminFacilitiesList({ per_page: 1 })
  const { data: curriculumsData, isLoading: curriculumsLoading } = useAdminCurriculumsList({ per_page: 1 })
  const { data: pmbData, isLoading: pmbLoading } = useAdminPmbRegistrationsList({ per_page: 1, status: 'pending' })
  const { data: recentNews, isLoading: recentLoading } = useAdminNewsList({ per_page: 3 })
  const { data: pendingPmb, isLoading: pendingPmbLoading } = useAdminPmbRegistrationsList({ per_page: 3, status: 'pending' })

  const counts: Record<string, number | undefined> = {
    news: newsData?.meta.total,
    teachers: teachersData?.meta.total,
    facilities: facilitiesData?.meta.total,
    curriculums: curriculumsData?.meta.total,
    pmb: pmbData?.meta.total,
  }

  const loadingMap: Record<string, boolean> = {
    news: newsLoading,
    teachers: teachersLoading,
    facilities: facilitiesLoading,
    curriculums: curriculumsLoading,
    pmb: pmbLoading,
  }

  return (
    <div className="space-y-8 admin-fade-in">
      <Card className="admin-card-elevated overflow-hidden border-primary/20">
        <div className="admin-sidebar-header p-6 sm:p-8">
          <p className="text-sm font-medium text-primary-foreground/80">Selamat datang kembali</p>
          <h1 className="mt-1 text-2xl font-bold text-primary-foreground sm:text-3xl">
            {user?.name ?? 'Administrator'}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
            Kelola konten, profil sekolah, kursus, dan pendaftaran siswa baru dari satu panel.
          </p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const isLoading = loadingMap[stat.key]
          const count = counts[stat.key]

          return (
            <Link
              key={stat.key}
              to={stat.href}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <Card className="admin-card group border-primary/10 transition-all hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <div className={`admin-stat-icon ${stat.gold ? 'admin-stat-icon-gold' : ''}`}>
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className={`text-3xl font-bold tabular-nums ${stat.gold ? 'text-gold' : ''}`}>{count ?? '—'}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Akses Cepat</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {adminNavTree.map((group) => (
              <Card key={group.label} className="admin-card border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{group.label}</CardTitle>
                  <CardDescription>{group.children.length} modul</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {group.children.slice(0, 4).map((item) => (
                    <Link
                      key={`${group.label}-${item.label}`}
                      to={item.href}
                      className="flex min-h-11 items-center rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Berita Terbaru</h2>
            <Card className="admin-card border-primary/10">
              <CardContent className="divide-y p-0">
                {recentLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : recentNews?.data.length ? (
                  recentNews.data.map((article) => (
                    <Link
                      key={article.id}
                      to={`/admin/news/${article.uuid}/edit`}
                      className="flex min-h-11 items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{article.title}</p>
                        <p className="text-sm text-muted-foreground">{article.category ?? 'Umum'}</p>
                      </div>
                      <AdminStatusBadge status={article.status ?? 'draft'} />
                    </Link>
                  ))
                ) : (
                  <p className="p-6 text-center text-sm text-muted-foreground">Belum ada berita.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">PMB Menunggu Review</h2>
            <Card className="admin-card border-primary/10">
              <CardContent className="divide-y p-0">
                {pendingPmbLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : pendingPmb?.data.length ? (
                  pendingPmb.data.map((reg) => (
                    <Link
                      key={reg.id}
                      to={`/admin/pmb-registrations/${reg.id}`}
                      className="flex min-h-11 items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{reg.student_name}</p>
                        <p className="text-sm text-muted-foreground">{reg.registration_number}</p>
                      </div>
                      <AdminStatusBadge status={reg.status} />
                    </Link>
                  ))
                ) : (
                  <p className="p-6 text-center text-sm text-muted-foreground">Tidak ada pendaftaran menunggu.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
