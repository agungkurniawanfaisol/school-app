import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeachersList } from '@/hooks/useTeachers'
import { TEACHER_TYPE_LABELS, type TeacherTypeValue } from '@/schemas/teacher'

export function TeachersCatalogPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useTeachersList({ per_page: 48, search: search || undefined })

  const teachers = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title="Guru & Tenaga Pendidik"
        description="Kenali tim pengajar profesional Sekolah Islam Nurul Hikmah."
      />
      <SubpageHero
        title="Guru & Tenaga Pendidik"
        subtitle="Tim pengajar berdedikasi yang membimbing siswa menuju kesuksesan akademik dan karakter."
        backHref="/"
        backLabel="Kembali ke beranda"
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama guru..."
              className="h-11 pl-9"
              aria-label="Cari guru"
            />
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : teachers.length === 0 ? (
            <p className="text-center text-muted-foreground">Tidak ada guru ditemukan.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teachers.map((teacher) => (
                <Link
                  key={teacher.id}
                  to={`/guru/${teacher.slug}`}
                  className="group block touch-manipulation rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card className="card-hover overflow-hidden border-primary/10">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <TeacherAvatar teacher={teacher} className="h-full w-full rounded-none text-4xl" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 via-primary/60 to-transparent p-4 pt-16 text-primary-foreground md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                        <p className="font-semibold">{teacher.name}</p>
                        {teacher.subject && (
                          <p className="text-sm text-primary-foreground/85">{teacher.subject}</p>
                        )}
                      </div>
                      <div className="absolute left-2 top-2 flex flex-col gap-1">
                        {teacher.type && teacher.type !== 'guru' && (
                          <Badge variant="secondary">
                            {TEACHER_TYPE_LABELS[teacher.type as TeacherTypeValue] ?? teacher.type}
                          </Badge>
                        )}
                        {teacher.is_featured && (
                          <Badge>Unggulan</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="border-t border-primary/10 py-3 text-center md:border-t-0">
                      <p className="font-medium text-foreground md:hidden">{teacher.name}</p>
                      {teacher.title && (
                        <p className="text-xs text-muted-foreground md:group-hover:text-primary">{teacher.title}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicPageShell>
  )
}
