import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet, apiPost } = vi.hoisted(() => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}))

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api')>('@/lib/api')
  return {
    ...actual,
    api: {
      get: apiGet,
      post: apiPost,
    },
  }
})

import { getAuthToken, getStoredUser, setAuthSession } from '@/lib/api'
import { useAuthMe, useGoogleExchange, useLogin, useLogout } from '@/hooks/useAuth'

describe('useAuthMe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('fetches /admin/me once when token exists', async () => {
    setAuthSession('token-1', {
      id: 1,
      name: 'Admin',
      email: 'admin@test.id',
      role: 'admin',
    })

    apiGet.mockResolvedValueOnce({
      data: {
        data: { id: 1, name: 'Admin', email: 'admin@test.id', role: 'admin' },
      },
    })

    const wrapper = createWrapper()
    const { result, rerender } = renderHook(() => useAuthMe(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiGet).toHaveBeenCalledTimes(1)
    expect(apiGet).toHaveBeenCalledWith('/admin/me')

    rerender()
    await waitFor(() => expect(result.current.isFetching).toBe(false))
    expect(apiGet).toHaveBeenCalledTimes(1)
  })
})

describe('useAuth mutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('login persists token and user in localStorage', async () => {
    apiPost.mockResolvedValueOnce({
      data: {
        data: {
          token: 'test-token-123',
          user: { id: 1, name: 'Admin', email: 'admin@sekolah.id', role: 'admin' },
        },
      },
    })

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: 'admin@sekolah.id', password: 'secret' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getAuthToken()).toBe('test-token-123')
    expect(getStoredUser()).toEqual({
      id: 1,
      name: 'Admin',
      email: 'admin@sekolah.id',
      role: 'admin',
    })
    expect(apiPost).toHaveBeenCalledWith('/admin/login', {
      email: 'admin@sekolah.id',
      password: 'secret',
    })
  })

  it('logout clears auth session', async () => {
    setAuthSession('existing-token', {
      id: 1,
      name: 'Admin',
      email: 'admin@sekolah.id',
      role: 'admin',
    })
    apiPost.mockResolvedValueOnce({ data: {} })

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() })

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getAuthToken()).toBeNull()
    expect(getStoredUser()).toBeNull()
    expect(apiPost).toHaveBeenCalledWith('/admin/logout')
  })

  it('google exchange persists token and user in localStorage', async () => {
    apiPost.mockResolvedValueOnce({
      data: {
        data: {
          token: 'google-token-456',
          user: { id: 2, name: 'Guru', email: 'guru@sekolah.id', role: 'guru' },
        },
      },
    })

    const { result } = renderHook(() => useGoogleExchange(), { wrapper: createWrapper() })

    result.current.mutate('11111111-1111-1111-1111-111111111111')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getAuthToken()).toBe('google-token-456')
    expect(getStoredUser()).toEqual({
      id: 2,
      name: 'Guru',
      email: 'guru@sekolah.id',
      role: 'guru',
    })
    expect(apiPost).toHaveBeenCalledWith('/admin/auth/google/exchange', {
      ticket: '11111111-1111-1111-1111-111111111111',
    })
  })
})
