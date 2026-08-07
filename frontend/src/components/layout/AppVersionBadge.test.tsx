import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppVersionBadge } from './AppVersionBadge'

describe('AppVersionBadge', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_APP_VERSION', '1.2.0')
  })

  it('renders version link to changelog', () => {
    render(
      <MemoryRouter>
        <AppVersionBadge />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /Versi aplikasi v1\.2\.0/i })
    expect(link).toHaveAttribute('href', '/riwayat-versi')
    expect(link).toHaveTextContent('v1.2.0')
  })
})
