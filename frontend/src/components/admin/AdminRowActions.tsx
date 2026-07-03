import { Eye, MoreHorizontal, Pencil, Trash2, Upload, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AdminContentRowActionsProps {
  uuid: string
  status?: string
  editHref: string
  previewHref?: string
  onPublish?: () => void
  onUnpublish?: () => void
  onDelete: () => void
  isPublishing?: boolean
}

function IconButton({
  label,
  children,
  onClick,
  disabled,
  asChild,
  href,
  destructive,
}: {
  label: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  asChild?: boolean
  href?: string
  destructive?: boolean
}) {
  const btn =
    asChild && href ? (
      <Button
        asChild
        size="icon"
        variant="ghost"
        className={`h-9 w-9 ${destructive ? 'text-destructive hover:text-destructive' : ''}`}
      >
        <Link to={href} aria-label={label}>
          {children}
        </Link>
      </Button>
    ) : (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={`h-9 w-9 ${destructive ? 'text-destructive hover:text-destructive' : ''}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
      >
        {children}
      </Button>
    )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function AdminContentRowActions({
  status,
  editHref,
  previewHref,
  onPublish,
  onUnpublish,
  onDelete,
  isPublishing,
}: AdminContentRowActionsProps) {
  const isPublished = status === 'published'

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex justify-end gap-0.5">
        <IconButton label="Edit" href={editHref} asChild>
          <Pencil className="h-4 w-4" />
        </IconButton>
        {previewHref && (
          <IconButton label="Pratinjau" href={previewHref} asChild>
            <Eye className="h-4 w-4" />
          </IconButton>
        )}
        {isPublished && onUnpublish ? (
          <IconButton label="Batalkan publikasi" onClick={onUnpublish} disabled={isPublishing}>
            <UploadCloud className="h-4 w-4" />
          </IconButton>
        ) : onPublish ? (
          <IconButton label="Publikasikan" onClick={onPublish} disabled={isPublishing}>
            <Upload className="h-4 w-4" />
          </IconButton>
        ) : null}
        <IconButton label="Hapus" onClick={onDelete} destructive>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </TooltipProvider>
  )
}

interface AdminSimpleRowActionsProps {
  editHref?: string
  onDelete?: () => void
  viewHref?: string
  extraItems?: { label: string; onClick: () => void }[]
}

export function AdminSimpleRowActions({ editHref, onDelete, viewHref, extraItems }: AdminSimpleRowActionsProps) {
  const hasMenu = extraItems?.length || onDelete

  if (!hasMenu && editHref) {
    return (
      <TooltipProvider delayDuration={300}>
        <IconButton label="Edit" href={editHref} asChild>
          <Pencil className="h-4 w-4" />
        </IconButton>
      </TooltipProvider>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="icon" variant="ghost" className="h-9 w-9" aria-label="Aksi lainnya">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewHref && (
          <DropdownMenuItem asChild>
            <Link to={viewHref}>Lihat detail</Link>
          </DropdownMenuItem>
        )}
        {editHref && (
          <DropdownMenuItem asChild>
            <Link to={editHref}>Edit</Link>
          </DropdownMenuItem>
        )}
        {extraItems?.map((item) => (
          <DropdownMenuItem key={item.label} onClick={item.onClick}>
            {item.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
              Hapus
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
