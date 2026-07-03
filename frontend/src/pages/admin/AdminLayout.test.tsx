import { cleanup, fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { renderWithProviders } from '@/test/renderWithProviders'

const useAuthMeMock = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuthMe: () => useAuthMeMock(),
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/components/theme/ThemeToggle', () => ({
  ThemeToggle: () => <button type="button">Tema</button>,
}))

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('redirects to login when no auth token', () => {
    useAuthMeMock.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
      isFetched: false,
      fetchStatus: 'idle',
    })

    renderWithProviders(<AdminLayout />, { route: '/admin', path: '/admin' })

    expect(screen.queryByRole('navigation', { name: 'Breadcrumb' })).not.toBeInTheDocument()
  })

  it('renders sidebar and scrollable main when authenticated', () => {
    localStorage.setItem('nh_admin_token', 'test-token')
    useAuthMeMock.mockReturnValue({
      data: { id: 1, name: 'Admin', email: 'admin@test.id', role: 'admin' },
      isPending: false,
      isError: false,
      isFetched: true,
      fetchStatus: 'idle',
      error: null,
    })

    const { container } = renderWithProviders(<AdminLayout />, { route: '/admin', path: '/admin' })

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Sidebar admin' })).toBeInTheDocument()
    const main = container.querySelector('#admin-main')
    expect(main).toHaveClass('overflow-y-auto')
    expect(container.querySelector('.lg\\:pl-72')).toBeInTheDocument()
  })

  it('uses collapsed content offset when sidebar is collapsed in storage', () => {
    localStorage.setItem('nh_admin_token', 'test-token')
    localStorage.setItem('nh_admin_sidebar_collapsed', 'true')
    useAuthMeMock.mockReturnValue({
      data: { id: 1, name: 'Admin', email: 'admin@test.id', role: 'admin' },
      isPending: false,
      isError: false,
      isFetched: true,
      fetchStatus: 'idle',
      error: null,
    })

    const { container } = renderWithProviders(<AdminLayout />, { route: '/admin', path: '/admin' })

    expect(container.querySelector('.lg\\:pl-16')).toBeInTheDocument()
  })

  it('toggles sidebar collapse from header', () => {
    localStorage.setItem('nh_admin_token', 'test-token')
    useAuthMeMock.mockReturnValue({
      data: { id: 1, name: 'Admin', email: 'admin@test.id', role: 'admin' },
      isPending: false,
      isError: false,
      isFetched: true,
      fetchStatus: 'idle',
      error: null,
    })

    const { container } = renderWithProviders(<AdminLayout />, { route: '/admin', path: '/admin' })

    fireEvent.click(screen.getAllByRole('button', { name: 'Ciutkan sidebar' })[0])

    expect(container.querySelector('.lg\\:pl-16')).toBeInTheDocument()
    expect(localStorage.getItem('nh_admin_sidebar_collapsed')).toBe('true')
  })
})
