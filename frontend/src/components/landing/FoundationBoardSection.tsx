import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionDivider } from '@/components/landing/SectionDivider'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { useTeachersList } from '@/hooks/useTeachers'
import { cn } from '@/lib/utils'
import type { Teacher } from '@/types'

export const FOUNDATION_BOARD_LIMIT = 4

const GRID_CLASS_BY_COUNT: Record<1 | 2 | 3 | 4, string> = {
  1: 'mx-auto max-w-xs grid-cols-1',
  2: 'mx-auto max-w-2xl grid-cols-1 sm:grid-cols-2',
  3: 'mx-auto max-w-4xl grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
}

function FoundationMemberCard({ member }: { member: Teacher }) {
  return (
    <Card className="h-full overflow-hidden border-primary/10 bg-gradient-to-b from-secondary/40 to-card text-center">
      <CardContent className="flex flex-col items-center gap-3 p-5 sm:p-6">
        <div className="overflow-hidden rounded-2xl border-2 border-primary/15 shadow-md">
          <TeacherAvatar teacher={member} size="lg" className="h-28 w-28 sm:h-32 sm:w-32" />
        </div>
        <div className="min-w-0 space-y-1">
          <h3 className="text-base font-bold text-foreground sm:text-lg">{member.name}</h3>
          {member.title ? (
            <p className="text-sm text-muted-foreground">{member.title}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export function FoundationBoardSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading } = useTeachersList({
    type: 'pimpinan_yayasan',
    per_page: FOUNDATION_BOARD_LIMIT,
  })
  const members = (data?.data ?? []).slice(0, FOUNDATION_BOARD_LIMIT)

  if (!isLoading && members.length === 0) return null

  const count = Math.min(Math.max(members.length, 1), 4) as 1 | 2 | 3 | 4

  return (
    <>
      <SectionDivider />
      <section id="pimpinan-yayasan" className="section-padding">
        <div className="container-page">
          <SectionHeader
            badge={t('foundationBoard.badge')}
            title={t('foundationBoard.title')}
            description={t('foundationBoard.desc')}
          />

          {isLoading ? (
            <div className={cn('grid gap-4 sm:gap-6', GRID_CLASS_BY_COUNT[4])}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <RevealOnScroll direction="up">
              <div className={cn('grid gap-4 sm:gap-6', GRID_CLASS_BY_COUNT[count])}>
                {members.map((member) => (
                  <FoundationMemberCard key={member.id} member={member} />
                ))}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>
    </>
  )
}
