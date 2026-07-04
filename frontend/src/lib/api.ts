import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { User } from '@/types'

const TOKEN_KEY = 'nh_admin_token'
const USER_KEY = 'nh_admin_user'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const lang = localStorage.getItem('nurul-hikmah-lang')
  if (lang && lang !== 'id') {
    config.headers['X-Locale'] = lang
  }

  // Let the browser set multipart boundary — never force Content-Type on FormData.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? ''
      const isProtectedAdmin = url.includes('/admin/') && !url.includes('/admin/login')

      if (isProtectedAdmin) {
        clearAuthSession()
      }
    }
    return Promise.reject(error)
  },
)

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as User
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function setAuthSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event('nh:auth-cleared'))
}

export function isAuthError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false
  }

  const status = error.response?.status
  return status === 401 || status === 403
}

export function isNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false
  }

  return !error.response && Boolean(error.request)
}

export function getApiErrorMessage(error: unknown, fallback = 'Terjadi kesalahan.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.message && typeof data.message === 'string') {
      return data.message.slice(0, 240)
    }
    if (data?.errors) {
      const first = Object.values(data.errors)[0] as string[] | undefined
      if (first?.[0]) return first[0].slice(0, 240)
    }
  }
  return fallback
}

export const SCHOOL_SLUG = import.meta.env.VITE_SCHOOL_SLUG ?? 'nurul-hikmah'
