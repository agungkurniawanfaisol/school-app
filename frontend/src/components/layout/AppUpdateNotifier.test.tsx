import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppUpdateNotifier } from './AppUpdateNotifier'

const toastMessage = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    message: (...args: unknown[]) => toastMessage(...args),
  },
}))

vi.mock('@/lib/app-version', async () => {
  const actual = await vi.importActual<typeof import('@/lib/app-version')>('@/lib/app-version')
  return {
    ...actual,
    fetchServerVersion: vi.fn(),
    shouldNotifyUpdate: vi.fn(),
  }
})

import { fetchServerVersion, shouldNotifyUpdate } from '@/lib/app-version'

describe('AppUpdateNotifier', () => {
  beforeEach(() => {
    toastMessage.mockReset()
    vi.mocked(fetchServerVersion).mockReset()
    vi.mocked(shouldNotifyUpdate).mockReset()
  })

  it('shows toast when update should notify', async () => {
    vi.mocked(fetchServerVersion).mockResolvedValue({ version: '1.1.0' })
    vi.mocked(shouldNotifyUpdate).mockReturnValue(true)

    render(<AppUpdateNotifier />)

    await waitFor(() => {
      expect(toastMessage).toHaveBeenCalled()
    })

    expect(toastMessage.mock.calls[0]?.[0]).toContain('v1.1.0')
  })

  it('does not toast when no update', async () => {
    vi.mocked(fetchServerVersion).mockResolvedValue({ version: '1.0.0' })
    vi.mocked(shouldNotifyUpdate).mockReturnValue(false)

    render(<AppUpdateNotifier />)

    await waitFor(() => {
      expect(fetchServerVersion).toHaveBeenCalled()
    })

    expect(toastMessage).not.toHaveBeenCalled()
  })
})
