import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LanguageSwitcher } from './LanguageSwitcher'
import { LanguageProvider } from './LanguageProvider'

vi.mock('@/lib/api', () => ({
  api: { defaults: { headers: { common: {} } } },
}))

function renderSwitcher() {
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  )
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('dir')
    document.documentElement.setAttribute('lang', 'id')
  })

  it('renders the globe button with aria-label', async () => {
    renderSwitcher()
    const button = await screen.findByRole('button', { name: /bahasa/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('has correct initial state', async () => {
    renderSwitcher()
    const button = await screen.findByRole('button', { name: /bahasa/i })
    expect(button).toHaveAttribute('data-state', 'closed')
  })

  it('globe icon is rendered inside the button', async () => {
    const { container } = renderSwitcher()
    await waitFor(() => {
      const svg = container.querySelector('svg.lucide-globe')
      expect(svg).toBeInTheDocument()
    })
  })
})
