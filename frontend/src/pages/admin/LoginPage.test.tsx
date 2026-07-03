import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoginPage } from '@/pages/admin/LoginPage'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/hooks/useAuth', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useAuthMe: () => ({
    data: undefined,
    isFetched: false,
    isError: false,
    fetchStatus: 'idle',
  }),
}))

vi.mock('@/components/theme', () => ({
  ThemeToggle: () => <button type="button" aria-label="Ubah tema tampilan">Tema</button>,
}))

describe('LoginPage', () => {
  it('shows login form fields', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getByText('Panel Admin')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Kembali/i })).toHaveAttribute('href', '/')
    expect(screen.getByPlaceholderText('admin@sekolah.id')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument()
  })

  it('uses mobile-friendly touch targets and input sizing', () => {
    const { container } = renderWithProviders(<LoginPage />)

    const emailInput = container.querySelector('input[name="email"]')
    const submitButton = container.querySelector('button[type="submit"]')

    expect(emailInput).not.toBeNull()
    expect(emailInput).toHaveClass('h-11')
    expect(emailInput).toHaveClass('text-base')
    expect(submitButton).not.toBeNull()
    expect(submitButton).toHaveClass('min-h-11')
    expect(submitButton).toHaveClass('w-full')
  })

  it('shows validation errors on empty submit', async () => {
    const { container } = renderWithProviders(<LoginPage />)

    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form!)

    expect(await screen.findByText('Email tidak valid')).toBeInTheDocument()
    expect(screen.getByText('Kata sandi wajib diisi')).toBeInTheDocument()
  })
})
