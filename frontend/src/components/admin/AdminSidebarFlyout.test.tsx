import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { AdminSidebarFlyout } from '@/components/admin/AdminSidebarFlyout'
import { AdminSidebarProvider, useAdminSidebar } from '@/components/admin/AdminSidebarContext'
import { renderWithProviders } from '@/test/renderWithProviders'

function FlyoutHarness() {
  const { openFlyout } = useAdminSidebar()

  return (
    <>
      <button type="button" onClick={() => openFlyout('Konten', 100)}>
        Buka flyout Konten
      </button>
      <AdminSidebarFlyout />
    </>
  )
}

describe('AdminSidebarFlyout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('does not render when flyout is closed', () => {
    renderWithProviders(
      <AdminSidebarProvider>
        <FlyoutHarness />
      </AdminSidebarProvider>,
    )

    expect(screen.queryByRole('navigation', { name: 'Menu Konten' })).not.toBeInTheDocument()
  })

  it('renders group card with children when open', () => {
    renderWithProviders(
      <AdminSidebarProvider>
        <FlyoutHarness />
      </AdminSidebarProvider>,
      { route: '/admin', path: '/admin' },
    )

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Buka flyout Konten' }))
    })

    expect(screen.getByRole('navigation', { name: 'Menu Konten' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Berita/i })).toBeInTheDocument()
    expect(screen.getByText('Konten')).toBeInTheDocument()
  })
})
