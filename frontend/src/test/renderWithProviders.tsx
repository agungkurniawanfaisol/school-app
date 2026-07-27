import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from '@/components/i18n/LanguageProvider'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
  path?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', path, ...options }: RenderWithProvidersOptions = {},
) {
  const queryClient = createTestQueryClient()

  function Wrapper({ children }: { children: ReactNode }) {
    const content = path ? (
      <Routes>
        <Route path={path} element={children} />
      </Routes>
    ) : (
      children
    )

    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <MemoryRouter initialEntries={[route]}>{content}</MemoryRouter>
        </LanguageProvider>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  }
}

export function createWrapper(options?: { route?: string; path?: string }) {
  const queryClient = createTestQueryClient()
  const { route = '/', path } = options ?? {}

  return function Wrapper({ children }: { children: ReactNode }) {
    const content = path ? (
      <Routes>
        <Route path={path} element={children} />
      </Routes>
    ) : (
      children
    )

    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <MemoryRouter initialEntries={[route]}>{content}</MemoryRouter>
        </LanguageProvider>
      </QueryClientProvider>
    )
  }
}
