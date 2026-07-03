import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { ThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthMe, useLogin } from '@/hooks/useAuth'
import { getApiErrorMessage, getAuthToken } from '@/lib/api'
import { loginSchema, type LoginFormValues } from '@/schemas/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const token = getAuthToken()
  const { data: user, isError, fetchStatus } = useAuthMe()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (token && user && !isError) {
    return <Navigate to="/admin" replace />
  }

  const isCheckingSession = token && !user && fetchStatus === 'fetching'

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: (data) => {
        toast.success('Login berhasil')
        navigate(data.user.role === 'guru' ? '/admin/profile' : '/admin')
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Login gagal'))
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
        <Card className="admin-fade-in w-full max-w-md overflow-hidden border-gold/30 shadow-xl ring-1 ring-gold/10">
          <div className="admin-sidebar-header px-4 py-6 text-center sm:px-6 sm:py-8">
            <SchoolLogo
              alt="Nurul Hikmah"
              variant="login"
              className="mx-auto max-h-12 w-auto brightness-0 invert sm:max-h-16"
            />
          </div>

          <CardHeader className="space-y-1 px-4 pb-2 text-center sm:px-6">
            <CardTitle className="text-xl text-primary sm:text-2xl">Panel Admin</CardTitle>
            <CardDescription className="text-pretty text-sm sm:text-base">
              Masuk ke akun administrator Nurul Hikmah
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 pb-6 sm:px-6">
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
                            onClick={() => setShowPassword((v) => !v)}
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
          </CardContent>
        </Card>
        )}
      </main>
    </div>
  )
}
