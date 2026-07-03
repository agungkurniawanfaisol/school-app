import { Clock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { useCourseDetail } from '@/hooks/useCourses'

export function CourseDetailPage() {
  const { slug = '' } = useParams()
  const { data: course, isLoading } = useCourseDetail(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col">
        <Header />
        <main className="container-page flex-1 section-padding">
          <Skeleton className="mb-6 h-64 w-full" />
          <Skeleton className="h-8 w-1/2" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex min-h-svh flex-col">
        <Header />
        <main className="container-page flex-1 section-padding text-center">
          <h1 className="text-2xl font-bold">Kursus tidak ditemukan</h1>
          <Button asChild className="mt-4">
            <Link to="/kursus">Kembali ke Katalog</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="container-page flex-1 section-padding">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="mb-6 h-64 w-full rounded-lg object-cover" />
            )}
            <div className="mb-4 flex flex-wrap gap-2">
              {course.level && <Badge variant="secondary">{course.level}</Badge>}
              {course.category && <Badge variant="outline">{course.category}</Badge>}
            </div>
            <h1 className="mb-4 text-3xl font-bold text-primary">{course.title}</h1>
            {course.description && (
              <p className="mb-8 whitespace-pre-line text-muted-foreground">{course.description}</p>
            )}

            {course.modules && course.modules.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">Materi Kursus</h2>
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((mod) => (
                    <AccordionItem key={mod.id} value={`mod-${mod.id}`}>
                      <AccordionTrigger>{mod.title}</AccordionTrigger>
                      <AccordionContent>
                        {mod.description && <p className="mb-3 text-sm text-muted-foreground">{mod.description}</p>}
                        <ul className="space-y-2">
                          {mod.lessons?.map((lesson) => (
                            <li key={lesson.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                              <span>{lesson.title}</span>
                              <div className="flex items-center gap-2">
                                {lesson.is_free_preview && <Badge variant="outline">Preview</Badge>}
                                {lesson.duration_minutes && (
                                  <span className="text-xs text-muted-foreground">{lesson.duration_minutes} mnt</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{formatCurrency(course.price)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.duration_minutes && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Total {course.duration_minutes} menit
                  </p>
                )}
                <Button className="w-full" disabled>
                  Daftar Kursus (Segera)
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/kursus">Kembali ke Katalog</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
