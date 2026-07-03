import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeachersList } from '@/hooks/useTeachers'

export function TeachersCatalogPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useTeachersList({ per_page: 48, search: search || undefined })

  const teachers = data?.data ?? []

  return (
    <>
      <PageMeta
        title="Guru & Tenaga Pendidik"
        description="Kenali tim pengajar profesional Sekolah Islam Nurul Hikmah."
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2 text-center">
            <Button asChild variant="ghost" size="sm" className="mb-2">
              <Link to="/#guru">← Kembali ke beranda</Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Guru & Tenaga Pendidik</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Tim pengajar berdedikasi yang membimbing siswa menuju kesuksesan akademik dan karakter.
            </p>
          </div>

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
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card className="card-hover overflow-hidden border-primary/10">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <TeacherAvatar teacher={teacher} className="h-full w-full rounded-none text-4xl" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 via-primary/60 to-transparent p-4 pt-16 text-primary-foreground">
                        <p className="font-semibold">{teacher.name}</p>
                        {teacher.subject && (
                          <p className="text-sm text-primary-foreground/85">{teacher.subject}</p>
                        )}
                      </div>
                      {teacher.is_featured && (
                        <Badge className="absolute left-2 top-2">Unggulan</Badge>
                      )}
                    </div>
                    {teacher.title && (
                      <CardContent className="py-3 text-center text-xs text-muted-foreground group-hover:text-primary">
                        {teacher.title}
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
