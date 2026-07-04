import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Header } from './Header'

const useLocationMock = vi.fn(() => ({ pathname: '/' }))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuRadioGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuRadioItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useLocation: () => useLocationMock(),
  }
})

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({
    data: { name: 'Nurul Hikmah', logo: null, whatsapp: '6281234567890' },
  }),
}))

vi.mock('@/components/theme/ThemeToggle', () => ({
  ThemeToggle: () => <button type="button" aria-label="Ubah tema tampilan">Tema</button>,
}))

vi.mock('@/components/i18n', () => ({
  LanguageSwitcher: () => <button type="button" aria-label="Ganti bahasa">Lang</button>,
}))

vi.mock('@/hooks/useAuth', () => ({
  useIsAuthenticated: () => false,
  useAuthMe: () => ({ data: null }),
}))

describe('Header', () => {
  function renderHeader() {
    return render(<Header />)
  }

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true, configurable: true })
  })

  afterEach(() => {
    cleanup()
    useLocationMock.mockReturnValue({ pathname: '/' })
  })

  it('uses hero overlay styles on homepage before scroll', () => {
    useLocationMock.mockReturnValue({ pathname: '/' })
    const { container } = renderHeader()
    const header = container.querySelector('header')

    expect(header).toHaveClass('fixed')
    expect(header).toHaveClass('from-primary/35')
    expect(header).not.toHaveClass('bg-background/90')
  })

  it('uses frosted glass styles on homepage after scroll', () => {
    useLocationMock.mockReturnValue({ pathname: '/' })
    Object.defineProperty(window, 'scrollY', { value: 80, writable: true, configurable: true })

    const { container } = renderHeader()
    const header = container.querySelector('header')

    expect(header).toHaveClass('bg-background')
    expect(header).toHaveClass('backdrop-blur-lg')
  })

  it('uses sticky solid navbar on non-home routes', () => {
    useLocationMock.mockReturnValue({ pathname: '/kursus' })
    const { container } = renderHeader()
    const header = container.querySelector('header')

    expect(header).toHaveClass('sticky')
    expect(header).not.toHaveClass('from-primary/35')
    expect(header).toHaveClass('bg-background')
  })

  it('renders tree navigation groups and login link', () => {
    renderHeader()
    expect(screen.getByRole('navigation', { name: 'Navigasi utama' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Profil' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Konten' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'PMB' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Login/ })).toHaveAttribute('href', '/admin/login')
  })
})
