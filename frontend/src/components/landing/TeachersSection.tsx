import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeachersList } from '@/hooks/useTeachers'

export function TeachersSection() {
  const { data, isLoading, isFetching } = useTeachersList({ per_page: 8, featured: true })

  return (
    <section id="guru" className="section-padding">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Guru & Tenaga Pendidik</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Tim pengajar profesional yang berdedikasi membimbing siswa menuju kesuksesan.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${isFetching ? 'opacity-70' : ''}`}>
            {data?.data.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden text-center transition-shadow hover:shadow-md">
                <div className="aspect-square overflow-hidden bg-muted">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt={teacher.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl font-bold text-primary/30">
                      {teacher.name.charAt(0)}
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{teacher.name}</CardTitle>
                  {teacher.title && <CardDescription>{teacher.title}</CardDescription>}
                </CardHeader>
                {teacher.subject && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-primary">{teacher.subject}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
