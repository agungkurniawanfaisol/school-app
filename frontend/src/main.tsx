import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionProvider } from '@/components/motion'
import { ThemeProvider, useTheme } from '@/components/theme'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import App from './App.tsx'
import { authKeys } from '@/hooks/useAuth'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AuthSessionSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const onAuthCleared = () => {
      queryClient.removeQueries({ queryKey: authKeys.all })
    }

    window.addEventListener('nh:auth-cleared', onAuthCleared)
    return () => window.removeEventListener('nh:auth-cleared', onAuthCleared)
  }, [queryClient])

  return null
}

function AppShell() {
  const { resolvedTheme } = useTheme()

  return (
    <TooltipProvider delayDuration={300}>
      <AuthSessionSync />
      <App />
      <Toaster position="top-center" richColors closeButton theme={resolvedTheme} />
    </TooltipProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MotionProvider>
          <AppShell />
        </MotionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
