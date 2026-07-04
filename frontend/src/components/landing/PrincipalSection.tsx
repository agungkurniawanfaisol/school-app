import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionDivider } from '@/components/landing/SectionDivider'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { useTeachersList } from '@/hooks/useTeachers'

export function PrincipalSection() {
  const { data, isLoading } = useTeachersList({ type: 'kepala_sekolah', per_page: 1 })
  const principal = data?.data?.[0]

  if (!isLoading && !principal) return null

  return (
    <>
    <SectionDivider />
    <section id="kepala-sekolah" className="section-padding">
      <div className="container-page">
        <SectionHeader
          badge="Kepala Sekolah"
          title="Pimpinan Kami"
          description="Memimpin dengan visi dan dedikasi untuk pendidikan berkualitas."
        />

        {isLoading ? (
          <div className="mx-auto max-w-3xl">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : principal ? (
          <RevealOnScroll direction="up">
            <Card className="mx-auto max-w-3xl overflow-hidden border-primary/15 bg-gradient-to-br from-secondary/50 to-card">
              <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8 md:p-10">
                <div className="shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg">
                  <TeacherAvatar
                    teacher={principal}
                    size="xl"
                    className="h-40 w-40 sm:h-48 sm:w-48"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Kepala Sekolah
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                    {principal.name}
                  </h3>
                  {principal.title && (
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {principal.title}
                    </p>
                  )}
                  {principal.bio && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {principal.bio}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </RevealOnScroll>
        ) : null}
      </div>
    </section>
    </>
  )
}
