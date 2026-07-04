import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionDivider } from '@/components/landing/SectionDivider'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { useTeachersList } from '@/hooks/useTeachers'
import type { Teacher } from '@/types'

function StaffCard({ staff }: { staff: Teacher }) {
  return (
    <Link
      to={`/guru/${staff.slug}`}
      className="block touch-manipulation rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="card-hover group h-full overflow-hidden border-primary/10">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="shrink-0 overflow-hidden rounded-xl border border-primary/10">
            <TeacherAvatar teacher={staff} size="md" className="h-16 w-16" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground group-hover:text-primary">
              {staff.name}
            </h3>
            {staff.title && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {staff.title}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function StaffSection() {
  const { data, isLoading } = useTeachersList({ type: 'staff', per_page: 12 })
  const staff = data?.data ?? []

  if (!isLoading && staff.length === 0) return null

  return (
    <>
    <SectionDivider />
    <section id="staff" className="section-padding">
      <div className="container-page">
        <SectionHeader
          badge="Tenaga Kependidikan"
          title="Staff & Tata Usaha"
          description="Tim administrasi yang mendukung kelancaran operasional sekolah."
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <RevealOnScroll direction="up">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((s) => (
                <StaffCard key={s.id} staff={s} />
              ))}
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
    </>
  )
}
