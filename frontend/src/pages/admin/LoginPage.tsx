import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminLoginCard } from '@/components/admin/auth/AdminLoginCard'
import { GoogleSignInButton } from '@/components/admin/auth/GoogleSignInButton'
import { ThemeToggle } from '@/components/theme'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthMe, useLogin } from '@/hooks/useAuth'
import { clearAuthSession, getApiErrorMessage, getAuthToken, isAuthError } from '@/lib/api'
import { getOAuthErrorMessage } from '@/lib/oauth'
import { loginSchema, type LoginFormValues } from '@/schemas/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const token = getAuthToken()
  const { data: user, isError, error, isLoading, isSuccess } = useAuthMe()

  useEffect(() => {
    if (token && isError && isAuthError(error)) {
      clearAuthSession()
    }
  }, [token, isError, error])

  useEffect(() => {
    const oauthError = searchParams.get('error')
    const message = getOAuthErrorMessage(oauthError)
    if (!message) {
      return
    }

    toast.error(message)
    setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (token && isSuccess && user && !isError) {
    return <Navigate to="/admin" replace />
  }

  const isCheckingSession = Boolean(token && isLoading)

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: (data) => {
        toast.success('Login berhasil')
        navigate(data.user.role === 'guru' ? '/admin/profile' : '/admin')
      },
      onError: (submitError) => {
        toast.error(getApiErrorMessage(submitError, 'Login gagal'))
      },
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-secondary via-background to-secondary/40 pattern-islamic">
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        <Button asChild variant="outline" size="sm" className="min-h-11 gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">Kembali</span>
          </Link>
        </Button>
        <ThemeToggle variant="outline" />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6">
        {isCheckingSession ? (
          <p className="text-sm text-muted-foreground">Memverifikasi sesi...</p>
        ) : (
          <AdminLoginCard>
            <GoogleSignInButton disabled={login.isPending} />

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="w-full border-t border-border/70" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="email-password" className="border-none">
                <AccordionTrigger className="min-h-11 rounded-lg border border-border/70 px-3 py-3 text-sm font-medium hover:no-underline hover:bg-muted/40">
                  Masuk dengan email & kata sandi
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="admin@sekolah.id"
                                className="h-11 text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kata Sandi</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? 'text' : 'password'}
                                  autoComplete="current-password"
                                  placeholder="••••••••"
                                  className="h-11 pr-11 text-base"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-11 w-11"
                                  onClick={() => setShowPassword((value) => !value)}
                                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="min-h-11 w-full text-base" disabled={login.isPending}>
                        {login.isPending ? 'Memproses...' : 'Masuk'}
                      </Button>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AdminLoginCard>
        )}
      </main>
    </div>
  )
}
