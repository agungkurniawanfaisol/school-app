import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuRadioGroup: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode
    onValueChange?: (v: string) => void
  }) => (
    <div>
      <button type="button" onClick={() => onValueChange?.('dark')}>
        set-dark
      </button>
      {children}
    </div>
  ),
  DropdownMenuRadioItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ThemeToggle', () => {
  it('renders theme control with accessible label', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )

    expect(screen.getByRole('button', { name: /ubah tema/i })).toBeInTheDocument()
  })
})
