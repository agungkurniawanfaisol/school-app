import { describe, expect, it, beforeEach } from 'vitest'
import axios from 'axios'
import { api, isNetworkError, setAuthSession } from '@/lib/api'

describe('api response interceptor', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('clears auth session on portal 401', async () => {
    setAuthSession('stale-token', {
      id: 1,
      name: 'Wali',
      email: 'wali@test.id',
      role: 'pendaftar',
    })

    const responseInterceptor = api.interceptors.response.handlers.find((h) => h?.rejected)?.rejected
    expect(responseInterceptor).toBeDefined()

    const error = new axios.AxiosError('Unauthorized')
    error.config = { url: '/v1/pmb/portal/me' } as never
    error.response = { status: 401, data: {}, statusText: 'Unauthorized', headers: {}, config: {} as never }

    await expect(responseInterceptor!(error)).rejects.toBe(error)
    expect(localStorage.getItem('nh_admin_token')).toBeNull()
    expect(localStorage.getItem('nh_admin_user')).toBeNull()
  })
})

describe('api request interceptor', () => {
  it('removes Content-Type for FormData so multipart boundary is set automatically', async () => {
    const formData = new FormData()
    formData.append('file', new File(['x'], 'a.jpg', { type: 'image/jpeg' }))

    const config = await new Promise<import('axios').InternalAxiosRequestConfig>((resolve, reject) => {
      const id = api.interceptors.request.handlers.findIndex((h) => h?.fulfilled)
      const handler = api.interceptors.request.handlers[id]?.fulfilled
      if (!handler) {
        reject(new Error('request interceptor not found'))
        return
      }

      Promise.resolve(
        handler({
          headers: { 'Content-Type': 'application/json' } as import('axios').AxiosRequestHeaders,
          data: formData,
        } as import('axios').InternalAxiosRequestConfig),
      )
        .then((value) => resolve(value as import('axios').InternalAxiosRequestConfig))
        .catch(reject)
    })

    expect(config.headers['Content-Type']).toBeUndefined()
  })
})

describe('isNetworkError', () => {
  it('detects axios network failures without response', () => {
    const error = new axios.AxiosError('Network Error')
    error.request = {}
    expect(isNetworkError(error)).toBe(true)
  })

  it('returns false for http error responses', () => {
    const error = new axios.AxiosError('Unauthorized')
    error.response = { status: 401, data: {}, statusText: 'Unauthorized', headers: {}, config: {} as never }
    expect(isNetworkError(error)).toBe(false)
  })
})
