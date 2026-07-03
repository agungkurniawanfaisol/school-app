import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { AdminSidebarFlyout } from '@/components/admin/AdminSidebarFlyout'
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext'
import { AdminSidebarTree } from '@/components/layout/AdminSidebarTree'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('AdminSidebarTree', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders dashboard and nav groups', () => {
    renderWithProviders(<AdminSidebarTree />, { route: '/admin', path: '/admin' })

    expect(screen.getByRole('navigation', { name: 'Navigasi admin' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Konten')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
    expect(screen.getByText('Sistem')).toBeInTheDocument()
  })

  it('marks active child route', () => {
    renderWithProviders(<AdminSidebarTree />, { route: '/admin/news', path: '/admin/news' })

    const beritaLink = screen.getByRole('link', { name: /Berita/i })
    expect(beritaLink).toHaveAttribute('aria-current', 'page')
    expect(beritaLink).toHaveAttribute('href', '/admin/news')
  })

  it('calls onNavigate when link clicked', () => {
    const onNavigate = vi.fn()

    renderWithProviders(<AdminSidebarTree onNavigate={onNavigate} />, {
      route: '/admin/teachers',
      path: '/admin/teachers',
    })

    fireEvent.click(screen.getByRole('link', { name: /Guru/i }))
    expect(onNavigate).toHaveBeenCalled()
  })

  it('navigates to group default href in icons mode', () => {
    renderWithProviders(
      <AdminSidebarProvider>
        <Routes>
          <Route path="/admin" element={<AdminSidebarTree mode="icons" />} />
          <Route path="/admin/news" element={<div>Halaman Berita</div>} />
        </Routes>
      </AdminSidebarProvider>,
      { route: '/admin' },
    )

    const nav = screen.getByRole('navigation', { name: 'Navigasi admin' })
    fireEvent.click(within(nav).getByRole('button', { name: 'Konten' }))

    expect(screen.getByText('Halaman Berita')).toBeInTheDocument()
  })

  it('opens group flyout on icon hover in icons mode', () => {
    renderWithProviders(
      <AdminSidebarProvider>
        <AdminSidebarTree mode="icons" />
        <AdminSidebarFlyout />
      </AdminSidebarProvider>,
      { route: '/admin', path: '/admin' },
    )

    const nav = screen.getByRole('navigation', { name: 'Navigasi admin' })
    fireEvent.mouseEnter(within(nav).getByRole('button', { name: 'Konten' }))

    expect(screen.getByRole('navigation', { name: 'Menu Konten' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Berita/i })).toBeInTheDocument()
  })
})
