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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('admin')
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null)
  const { data, isLoading, isFetching } = useAdminFacilitiesList({ page, per_page: 15, search })
  const deleteFacility = useDeleteFacility()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.facilities.listTitle')}
        description={t('pages.facilities.listDesc')}
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
            header: t('table.name'),
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
            header: t('table.photo'),
            cell: (item) => (
              <span className="tabular-nums text-muted-foreground">{t('pages.facilities.photoCount', { count: item.photos?.length ?? 0 })}</span>
            ),
          },
          {
            key: 'featured',
            header: t('table.featured'),
            cell: (item) => (
              <Badge variant={item.is_featured ? 'default' : 'secondary'}>
                {item.is_featured ? t('common.yes') : t('common.no')}
              </Badge>
            ),
          },
          {
            key: 'active',
            header: t('table.status'),
            cell: (item) => (
              <Badge variant={item.is_active ? 'default' : 'secondary'}>
                {item.is_active ? t('status.active') : t('status.inactive')}
              </Badge>
            ),
          },
        ]}
        rowActions={(item) => (
          <div className="flex flex-wrap justify-end gap-1">
            <Button asChild size="sm" variant="ghost" className="min-h-11 min-w-11">
              <Link to={`/admin/facilities/${item.uuid}/edit`} aria-label={t('pages.facilities.editAria', { name: item.name })}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="min-h-11 min-w-11">
              <Link
                to={`/admin/facilities/${item.uuid}/preview`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('pages.facilities.previewAria', { name: item.name })}
              >
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="min-h-11 min-w-11 text-destructive hover:text-destructive"
              aria-label={t('pages.facilities.deleteAria', { name: item.name })}
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
            <DialogTitle>{t('pages.facilities.deleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('pages.facilities.deleteDesc', { name: deleteTarget?.name ?? '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {t('common.cancel')}
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
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
