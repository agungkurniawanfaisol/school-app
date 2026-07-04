import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '@/lib/i18n'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { MotionProvider } from '@/components/motion'
import { LanguageProvider } from '@/components/i18n'
import { ThemeProvider, useTheme } from '@/components/theme'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import App from './App.tsx'
import { authKeys } from '@/hooks/useAuth'
import './index.css'

// #region agent log
const __dbg = (msg: string, data?: Record<string, unknown>) => { fetch('http://127.0.0.1:7357/ingest/9d8959b5-b5eb-49d7-b822-17cfa3051c69',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'30f7f9'},body:JSON.stringify({sessionId:'30f7f9',location:'main.tsx',message:msg,data:data??{},timestamp:Date.now(),hypothesisId:'A,C,D'})}).catch(()=>{}); };
__dbg('main.tsx module evaluated', { timeSinceOrigin: performance.now() });
// #endregion

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

  // #region agent log
  useEffect(() => { __dbg('AppShell mounted (first render complete)', { timeSinceOrigin: performance.now() }); }, []);
  // #endregion

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <MotionProvider>
              <AppShell />
            </MotionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
