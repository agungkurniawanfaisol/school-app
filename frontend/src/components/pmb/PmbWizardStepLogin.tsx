import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resolveGoogleOAuthUrl } from '@/lib/oauth'
import { toast } from 'sonner'
import type { UseMutationResult } from '@tanstack/react-query'
import type { LoginFormValues } from '@/schemas/auth'

interface PmbWizardStepLoginProps {
  loginEmail: string
  loginPassword: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onLogin: () => void
  portalLogin: UseMutationResult<unknown, Error, LoginFormValues, unknown>
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

interface PmbWizardStepLoginProps {
  loginEmail: string
  loginPassword: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onLogin: () => void
  portalLogin: UseMutationResult<unknown, Error, LoginFormValues, unknown>
}

export function PmbWizardStepLogin({
  loginEmail,
  loginPassword,
  onEmailChange,
  onPasswordChange,
  onLogin,
  portalLogin,
}: PmbWizardStepLoginProps) {
  const [showPassword, setShowPassword] = useState(false)

  const startGoogle = async () => {
    try {
      window.location.assign(await resolveGoogleOAuthUrl('pmb'))
    } catch {
      toast.error('Login Google gagal. Silakan coba lagi.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
        <div className="space-y-2">
          <Label htmlFor="portal-email">Email</Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="portal-email"
              type="email"
              autoComplete="email"
              className="h-11 pl-10 focus-visible:ring-primary/30"
              placeholder="nama@email.com"
              value={loginEmail}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portal-password">Kata sandi</Label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="portal-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="h-11 pl-10 pr-11 focus-visible:ring-primary/30"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(event) => onPasswordChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onLogin()
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-11 -translate-y-1/2 text-muted-foreground"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button type="button" className="h-11 w-full" onClick={onLogin} disabled={portalLogin.isPending}>
          {portalLogin.isPending ? 'Memproses…' : 'Masuk'}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">atau</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-3 border-primary/20"
        onClick={() => void startGoogle()}
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        Masuk dengan Google
      </Button>
    </div>
  )
}
