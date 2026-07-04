import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Eye, ExternalLink, Pencil, Power, Search, Star, Trash2, Users } from 'lucide-react'
import { AdminMiniStat, AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminTeachersList, useDeleteTeacher, useUpdateTeacher } from '@/hooks/useTeachers'
import { TEACHER_TYPE_LABELS, type TeacherTypeValue } from '@/schemas/teacher'
import type { Teacher } from '@/types'

function TeacherListCard({
  teacher,
  onToggleActive,
  onDelete,
  isToggling,
}: {
  teacher: Teacher
  onToggleActive: () => void
  onDelete: (teacher: Teacher) => void
  isToggling: boolean
}) {
  return (
    <Card className="group overflow-hidden border-primary/10 transition-all duration-200 hover:border-primary/25 hover:shadow-md motion-reduce:transition-none">
      <CardContent className="p-0">
        <Link
          to={`/admin/teachers/${teacher.uuid}`}
          className="flex cursor-pointer flex-col sm:flex-row"
          aria-label={`Lihat detail ${teacher.name}`}
        >
          <div className="relative shrink-0 bg-muted sm:w-28">
            <TeacherAvatar teacher={teacher} size="lg" className="h-28 w-full rounded-none sm:h-full sm:w-28 sm:rounded-none" />
            {teacher.is_featured && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                <Star className="h-3 w-3 fill-current" aria-hidden />
                Unggulan
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-semibold text-foreground group-hover:text-primary">{teacher.name}</h2>
                {teacher.type && teacher.type !== 'guru' && (
                  <Badge variant={teacher.type === 'kepala_sekolah' ? 'default' : 'secondary'} className="shrink-0 text-[10px]">
                    {TEACHER_TYPE_LABELS[teacher.type as TeacherTypeValue] ?? teacher.type}
                  </Badge>
                )}
              </div>
              {teacher.title && <p className="truncate text-sm text-muted-foreground">{teacher.title}</p>}
              {teacher.subject && (
                <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {teacher.subject}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <Badge variant={teacher.is_active ? 'default' : 'secondary'}>
                {teacher.is_active ? 'Aktif' : 'Nonaktif'}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:opacity-100">
                Detail
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </div>
          </div>
        </Link>

        <div className="flex flex-wrap justify-end gap-1 border-t border-primary/10 p-2">
          <Button asChild size="sm" variant="ghost" className="min-h-11 min-w-11">
            <Link
              to={`/admin/teachers/${teacher.uuid}/preview`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Pratinjau ${teacher.name}`}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="min-h-11 min-w-11">
            <Link to={`/admin/teachers/${teacher.uuid}/edit`} aria-label={`Edit ${teacher.name}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="min-h-11 min-w-11">
            <Link to={`/admin/teachers/${teacher.uuid}`} aria-label={`Detail ${teacher.name}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="min-h-11 min-w-11"
            disabled={isToggling}
            aria-label={teacher.is_active ? `Nonaktifkan ${teacher.name}` : `Aktifkan ${teacher.name}`}
            onClick={onToggleActive}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="min-h-11 min-w-11 text-destructive hover:text-destructive"
            aria-label={`Hapus ${teacher.name}`}
            onClick={() => onDelete(teacher)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ListPagination({
  lastPage,
  page,
  onPageChange,
}: {
  lastPage: number
  page: number
  onPageChange: (page: number) => void
}) {
  if (lastPage <= 1) return null

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-muted-foreground md:hidden">
        Halaman {page} dari {lastPage}
      </p>
      <Pagination>
        <PaginationContent className="flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="min-h-11"
            />
          </PaginationItem>
          <div className="hidden md:contents">
            {Array.from({ length: lastPage }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1]
                const items = []
                if (prev && p - prev > 1) {
                  items.push(
                    <PaginationItem key={`ellipsis-${p}`}>
                      <span className="px-2">...</span>
                    </PaginationItem>,
                  )
                }
                items.push(
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => onPageChange(p)}
                      className="min-h-11 min-w-11"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>,
                )
                return items
              })}
          </div>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(lastPage, page + 1))}
              disabled={page >= lastPage}
              className="min-h-11"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export function AdminTeachersListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | TeacherTypeValue>('all')
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null)
  const [toggleTarget, setToggleTarget] = useState<Teacher | null>(null)

  const listFilters = {
    page,
    per_page: 12,
    search: search || undefined,
    ...(statusFilter === 'active' ? { is_active: true } : {}),
    ...(statusFilter === 'inactive' ? { is_active: false } : {}),
    ...(featuredFilter === 'featured' ? { is_featured: true } : {}),
    ...(typeFilter !== 'all' ? { type: typeFilter } : {}),
  }

  const { data, isLoading, isFetching } = useAdminTeachersList(listFilters)
  const deleteTeacher = useDeleteTeacher()

  const teachers = data?.data ?? []
  const activeCount = teachers.filter((t) => t.is_active).length
  const featuredCount = teachers.filter((t) => t.is_featured).length

  return (
    <div className="admin-fade-in space-y-4 sm:space-y-6">
      <AdminPageHeader
        title="Kelola Guru"
        description="Direktori tenaga pendidik sekolah — kelola profil, status, dan konten publik."
        totalCount={data?.meta.total}
        totalLabel="guru"
        createHref="/admin/teachers/create"
        createLabel="Tambah Guru"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminMiniStat label="Total Guru" value={data?.meta.total ?? '—'} icon={Users} />
        <AdminMiniStat
          label="Aktif (halaman ini)"
          value={isLoading ? '—' : activeCount}
          icon={Users}
          tone="success"
        />
        <AdminMiniStat
          label="Unggulan (halaman ini)"
          value={isLoading ? '—' : featuredCount}
          icon={Star}
          tone="gold"
        />
      </div>

      <div className="admin-list-panel">
        <div className="admin-list-toolbar">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Cari nama atau slug guru..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="h-11 pl-9"
                aria-label="Cari guru"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as typeof statusFilter)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-11 w-full sm:w-40" aria-label="Filter status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={featuredFilter}
              onValueChange={(v) => {
                setFeaturedFilter(v as typeof featuredFilter)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-11 w-full sm:w-44" aria-label="Filter unggulan">
                <SelectValue placeholder="Unggulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua guru</SelectItem>
                <SelectItem value="featured">Unggulan saja</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v as typeof typeFilter)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-11 w-full sm:w-44" aria-label="Filter tipe">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua tipe</SelectItem>
                <SelectItem value="kepala_sekolah">Kepala Sekolah</SelectItem>
                <SelectItem value="guru">Guru</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={`grid gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="flex p-0">
                <Skeleton className="h-28 w-28 shrink-0 rounded-none" />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : teachers.length ? (
          teachers.map((teacher) => (
            <TeacherListCardWithActions
              key={teacher.uuid}
              teacher={teacher}
              onDelete={setDeleteTarget}
              onToggleRequest={setToggleTarget}
            />
          ))
        ) : (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground/50" aria-hidden />
              <p className="text-sm text-muted-foreground">
                {search ? 'Tidak ada guru yang cocok dengan pencarian.' : 'Belum ada data guru.'}
              </p>
              {!search && (
                <Button asChild size="sm">
                  <Link to="/admin/teachers/create">Tambah Guru Pertama</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
        </div>

        {data?.meta && (
          <div className="border-t border-primary/10 px-4 py-4 sm:px-6">
            <ListPagination lastPage={data.meta.last_page} page={page} onPageChange={setPage} />
          </div>
        )}
      </div>

      <Dialog open={!!toggleTarget} onOpenChange={(open) => !open && setToggleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{toggleTarget?.is_active ? 'Nonaktifkan guru?' : 'Aktifkan guru?'}</DialogTitle>
            <DialogDescription>
              {toggleTarget?.is_active
                ? `Guru "${toggleTarget?.name}" tidak akan tampil di halaman publik. Data tetap tersimpan dan bisa diaktifkan kembali.`
                : `Guru "${toggleTarget?.name}" akan tampil kembali di situs publik.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleTarget(null)}>
              Batal
            </Button>
            <ToggleConfirmButton teacher={toggleTarget} onDone={() => setToggleTarget(null)} />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus guru?</DialogTitle>
            <DialogDescription>
              Guru &quot;{deleteTarget?.name}&quot; akan dihapus permanen.
              {deleteTarget?.has_linked_user && ' Akun guru terkait akan dilepas dari profil ini.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteTeacher.isPending}
              onClick={async () => {
                if (!deleteTarget) return
                await deleteTeacher.mutateAsync(deleteTarget.uuid)
                setDeleteTarget(null)
                navigate('/admin/teachers')
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ToggleConfirmButton({ teacher, onDone }: { teacher: Teacher | null; onDone: () => void }) {
  const updateTeacher = useUpdateTeacher(teacher?.uuid ?? '')
  if (!teacher) return null
  return (
    <Button
      disabled={updateTeacher.isPending}
      onClick={async () => {
        await updateTeacher.mutateAsync({ is_active: !teacher.is_active })
        onDone()
      }}
    >
      {teacher.is_active ? 'Nonaktifkan' : 'Aktifkan'}
    </Button>
  )
}

function TeacherListCardWithActions({
  teacher,
  onDelete,
  onToggleRequest,
}: {
  teacher: Teacher
  onDelete: (teacher: Teacher) => void
  onToggleRequest: (teacher: Teacher) => void
}) {
  const updateTeacher = useUpdateTeacher(teacher.uuid)

  return (
    <TeacherListCard
      teacher={teacher}
      isToggling={updateTeacher.isPending}
      onToggleActive={() => onToggleRequest(teacher)}
      onDelete={onDelete}
    />
  )
}
