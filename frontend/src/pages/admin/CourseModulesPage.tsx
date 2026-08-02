import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminCourseModulesList,
  useCreateCourseModule,
  useDeleteCourseModule,
} from '@/hooks/useCourseModules'
import {
  useAdminCourseLessonsList,
  useCreateCourseLesson,
  useDeleteCourseLesson,
} from '@/hooks/useCourseLessons'
import { useAdminCourseDetail } from '@/hooks/useCourses'
import { slugify } from '@/lib/utils'
import type { CourseModule } from '@/types'

function ModuleLessons({ moduleId }: { moduleId: number }) {
  const { t } = useTranslation('admin')
  const { data } = useAdminCourseLessonsList({ course_module_id: moduleId, per_page: 50 })
  const createLesson = useCreateCourseLesson()
  const deleteLesson = useDeleteCourseLesson()
  const [title, setTitle] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  return (
    <div className="space-y-3 border-t border-primary/10 pt-3">
      <p className="text-sm font-medium">{t('form.lessons')}</p>
      <ul className="space-y-2">
        {data?.data.map((lesson) => (
          <li key={lesson.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
            <span>{lesson.title}</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-11 text-destructive"
              aria-label={t('common.delete')}
              onClick={() => setDeleteId(lesson.id)}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder={t('form.newLessonTitle')} value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
        <Button
          type="button"
          size="sm"
          className="h-11 w-full sm:w-auto"
          disabled={!title || createLesson.isPending}
          onClick={() => {
            const slug = slugify(title)
            createLesson.mutate(
              { course_module_id: moduleId, title, slug, type: 'text', order: (data?.data.length ?? 0), is_active: true, is_free_preview: false },
              { onSuccess: () => setTitle('') },
            )
          }}
        >
          {t('common.add')}
        </Button>
      </div>
      <AdminDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return
          deleteLesson.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
        }}
        isLoading={deleteLesson.isPending}
      />
    </div>
  )
}

export function CourseModulesPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const { data: course, isLoading: courseLoading } = useAdminCourseDetail(courseId)
  const { data: modules, isLoading } = useAdminCourseModulesList({ course_id: courseId, per_page: 50 })
  const createModule = useCreateCourseModule()
  const deleteModule = useDeleteCourseModule()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<CourseModule | null>(null)

  if (courseLoading || isLoading) {
    return <p className="text-sm text-muted-foreground">{t('common.loadingModules')}</p>
  }

  return (
    <AdminFormShell title={t('pages.courses.modulesTitle') + ': ' + (course?.title ?? t('table.course'))} backHref="/admin/courses">
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="module_title">{t('common.addNew')} {t('common.module')}</Label>
            <Input id="module_title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('form.newModuleTitle')} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module_desc">{t('form.description')}</Label>
            <Textarea id="module_desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <Button
            type="button"
            disabled={!title || createModule.isPending}
            onClick={() => {
              createModule.mutate(
                {
                  course_id: courseId,
                  title,
                  slug: slugify(title),
                  description: description || null,
                  order: modules?.data.length ?? 0,
                  is_active: true,
                },
                { onSuccess: () => { setTitle(''); setDescription('') } },
              )
            }}
          >
            <Plus className="h-4 w-4" />
            {t('pages.courses.addModule')}
          </Button>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-2">
        {modules?.data.map((mod) => (
          <AccordionItem key={mod.id} value={String(mod.id)} className="admin-card overflow-hidden rounded-xl border px-4">
            <div className="flex items-center gap-2">
              <AccordionTrigger className="flex-1 hover:no-underline">{mod.title}</AccordionTrigger>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-11 shrink-0 text-destructive"
                aria-label={t('common.delete')}
                onClick={() => setDeleteTarget(mod)}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
            </div>
            <AccordionContent>
              <ModuleLessons moduleId={mod.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteModule.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteModule.isPending}
      />
    </AdminFormShell>
  )
}
