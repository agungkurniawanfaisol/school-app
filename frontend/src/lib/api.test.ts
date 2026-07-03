import { describe, expect, it } from 'vitest'
import axios from 'axios'
import { api, isNetworkError } from '@/lib/api'

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
