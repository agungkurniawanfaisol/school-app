import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminContentRowActions } from '@/components/admin/AdminRowActions'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div role="menu">{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
  }) => (
    <button type="button" role="menuitem" className={className} onClick={onClick}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
}))

afterEach(() => {
  cleanup()
})

describe('AdminContentRowActions', () => {
  it('exposes mobile overflow menu with edit and delete', () => {
    const onDelete = vi.fn()

    renderWithProviders(
      <AdminContentRowActions
        uuid="abc-123"
        status="draft"
        editHref="/admin/news/abc-123/edit"
        onDelete={onDelete}
      />,
    )

    expect(screen.getByRole('button', { name: /aksi lainnya/i })).toBeInTheDocument()
    const editLinks = screen.getAllByRole('link', { name: /^edit$/i })
    expect(editLinks.some((link) => link.getAttribute('href') === '/admin/news/abc-123/edit')).toBe(true)

    fireEvent.click(screen.getByRole('menuitem', { name: /hapus/i }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('includes publish action in mobile menu when provided', () => {
    const onPublish = vi.fn()

    renderWithProviders(
      <AdminContentRowActions
        uuid="abc-123"
        status="draft"
        editHref="/admin/news/abc-123/edit"
        onPublish={onPublish}
        onDelete={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('menuitem', { name: /publikasikan/i }))
    expect(onPublish).toHaveBeenCalledTimes(1)
  })
})
