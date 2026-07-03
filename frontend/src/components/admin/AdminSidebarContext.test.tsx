import { act, cleanup, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import {
  AdminSidebarProvider,
  useAdminSidebar,
} from '@/components/admin/AdminSidebarContext'
import { renderWithProviders } from '@/test/renderWithProviders'

function SidebarConsumer() {
  const { collapsed, toggleCollapsed, contentOffsetClass } = useAdminSidebar()
  return (
    <div>
      <span data-testid="collapsed">{String(collapsed)}</span>
      <span data-testid="offset">{contentOffsetClass}</span>
      <button type="button" onClick={toggleCollapsed}>
        Toggle
      </button>
    </div>
  )
}

describe('AdminSidebarContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('defaults to expanded sidebar', () => {
    renderWithProviders(
      <AdminSidebarProvider>
        <SidebarConsumer />
      </AdminSidebarProvider>,
    )

    expect(screen.getByTestId('collapsed')).toHaveTextContent('false')
    expect(screen.getByTestId('offset')).toHaveTextContent('lg:pl-72')
  })

  it('reads collapsed state from localStorage', () => {
    localStorage.setItem('nh_admin_sidebar_collapsed', 'true')

    renderWithProviders(
      <AdminSidebarProvider>
        <SidebarConsumer />
      </AdminSidebarProvider>,
    )

    expect(screen.getByTestId('collapsed')).toHaveTextContent('true')
    expect(screen.getByTestId('offset')).toHaveTextContent('lg:pl-16')
  })

  it('persists toggle to localStorage', () => {
    renderWithProviders(
      <AdminSidebarProvider>
        <SidebarConsumer />
      </AdminSidebarProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: 'Toggle' }).click()
    })

    expect(screen.getByTestId('collapsed')).toHaveTextContent('true')
    expect(localStorage.getItem('nh_admin_sidebar_collapsed')).toBe('true')
  })

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useAdminSidebar())).toThrow(
      'useAdminSidebar must be used within AdminSidebarProvider',
    )
  })
})
