import { cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/hooks/useAuth', () => ({
  useAuthMe: () => ({
    data: { id: 1, name: 'Admin Nurul', email: 'admin@sekolah.id', role: 'admin' },
    isLoading: false,
  }),
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/components/theme/ThemeToggle', () => ({
  ThemeToggle: () => <button type="button">Tema</button>,
}))

function renderHeader(route = '/admin', path = '/admin') {
  return renderWithProviders(
    <AdminSidebarProvider>
      <AdminHeader />
    </AdminSidebarProvider>,
    { route, path },
  )
}

describe('AdminHeader', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders breadcrumb for news page', () => {
    renderHeader('/admin/news', '/admin/news')

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Berita' })).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('opens navigation sheet when menu is tapped', () => {
    renderHeader()

    fireEvent.click(screen.getAllByRole('button', { name: 'Buka menu navigasi' })[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navigasi admin' })).toBeInTheDocument()
  })

  it('renders desktop collapse toggle', () => {
    renderHeader()

    expect(screen.getByRole('button', { name: 'Ciutkan sidebar' })).toBeInTheDocument()
  })
})
