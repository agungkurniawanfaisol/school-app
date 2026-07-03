import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Eye, Pencil, Trash2 } from 'lucide-react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAdminFacilitiesList, useDeleteFacility } from '@/hooks/useFacilities'
import type { Facility } from '@/types'

function FacilityThumbnail({ facility }: { facility: Facility }) {
  const src = facility.thumbnail ?? facility.photos?.[0]?.url ?? facility.photos?.[0]?.path
  if (src) {
    return (
      <img
        src={src.startsWith('http') || src.startsWith('/') ? src : `/storage/${src}`}
        alt=""
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
        loading="lazy"
      />
    )
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Building2 className="h-4 w-4" aria-hidden />
    </div>
  )
}

export function AdminFacilitiesListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null)
  const { data, isLoading, isFetching } = useAdminFacilitiesList({ page, per_page: 15, search })
  const deleteFacility = useDeleteFacility()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Fasilitas"
        description="Sarana dan prasarana sekolah dengan galeri foto dan konten detail"
        data={data?.data}
        meta={data?.meta}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        createHref="/admin/facilities/create"
        columns={[
          {
            key: 'name',
            header: 'Nama',
            cell: (item) => (
              <div className="flex items-center gap-3">
                <FacilityThumbnail facility={item} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                  {item.category && <p className="truncate text-xs text-muted-foreground">{item.category}</p>}
                </div>
              </div>
            ),
          },
          {
            key: 'photos',
            header: 'Foto',
            cell: (item) => (
              <span className="tabular-nums text-muted-foreground">{item.photos?.length ?? 0} foto</span>
            ),
          },
          {
            key: 'featured',
            header: 'Unggulan',
            cell: (item) => (
              <Badge variant={item.is_featured ? 'default' : 'secondary'}>
                {item.is_featured ? 'Ya' : 'Tidak'}
              </Badge>
            ),
          },
          {
            key: 'active',
            header: 'Status',
            cell: (item) => (
              <Badge variant={item.is_active ? 'default' : 'secondary'}>
                {item.is_active ? 'Aktif' : 'Nonaktif'}
              </Badge>
            ),
          },
        ]}
        rowActions={(item) => (
          <div className="flex flex-wrap justify-end gap-1">
            <Button asChild size="sm" variant="ghost" className="h-9">
              <Link to={`/admin/facilities/${item.uuid}/edit`} aria-label={`Edit ${item.name}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="h-9">
              <Link
                to={`/admin/facilities/${item.uuid}/preview`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Pratinjau ${item.name}`}
              >
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 text-destructive hover:text-destructive"
              aria-label={`Hapus ${item.name}`}
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus fasilitas?</DialogTitle>
            <DialogDescription>
              Fasilitas &quot;{deleteTarget?.name}&quot; beserta galeri fotonya akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteFacility.isPending}
              onClick={async () => {
                if (!deleteTarget) return
                await deleteFacility.mutateAsync(deleteTarget.uuid)
                setDeleteTarget(null)
                navigate('/admin/facilities')
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
