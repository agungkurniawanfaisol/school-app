import { Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchool } from '@/hooks/useSchool'

export function AboutSection() {
  const { data: school, isLoading } = useSchool()

  if (isLoading) {
    return (
      <section id="tentang" className="section-padding">
        <div className="container-page space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      </section>
    )
  }

  return (
    <section id="tentang" className="section-padding">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Tentang Kami</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {school?.description ?? 'Kami berkomitmen memberikan pendidikan terbaik dengan landasan nilai-nilai Islami.'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {school?.vision && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{school.vision}</p>
              </CardContent>
            </Card>
          )}
          {school?.mission && (
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Misi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">{school.mission}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
