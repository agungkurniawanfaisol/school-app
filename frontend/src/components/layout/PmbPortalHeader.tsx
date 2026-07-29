import { Info, LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PmbNotificationBell } from '@/components/pmb/PmbNotificationBell'
import { Button } from '@/components/ui/button'
import { useAuthMe, useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface PmbPortalHeaderProps {
  title: string
  subtitle?: string
  isAuthenticated: boolean
  onOpenMenu?: () => void
  className?: string
}

export function PmbPortalHeader({
  title,
  subtitle,
  isAuthenticated,
  onOpenMenu,
  className,
}: PmbPortalHeaderProps) {
  const { data: user } = useAuthMe()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => window.location.assign('/pmb/daftar') })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-20 shrink-0 border-b border-primary/10 bg-background/95 shadow-sm shadow-primary/5 backdrop-blur-md supports-[backdrop-filter]:bg-background/85',
        'pt-[max(0.75rem,env(safe-area-inset-top))]',
        className,
      )}
    >
      <div className="flex min-h-14 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {onOpenMenu && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 shrink-0 border-primary/20 lg:hidden"
            aria-label="Buka menu portal"
            onClick={onOpenMenu}
          >
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-primary sm:text-xs">Portal PMB</p>
          <h1 className="truncate text-base font-semibold leading-tight sm:text-lg">{title}</h1>
        </div>

        {isAuthenticated && <PmbNotificationBell />}

        <div
          className="flex h-11 shrink-0 items-stretch overflow-hidden rounded-lg border border-primary/15 bg-background shadow-sm"
          role="group"
          aria-label="Aksi portal"
        >
          <Button
            asChild
            variant="ghost"
            className="h-full gap-1.5 rounded-none px-3 text-muted-foreground hover:bg-muted/60 hover:text-foreground sm:px-3.5"
          >
            <Link to="/pmb">
              <Info className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Info PMB</span>
              <span className="sr-only sm:hidden">Info PMB</span>
            </Link>
          </Button>

          {isAuthenticated && user && (
            <>
              <span className="w-px self-stretch bg-primary/15" aria-hidden />
              <Button
                type="button"
                variant="ghost"
                className="h-full gap-1.5 rounded-none px-3 text-muted-foreground hover:bg-muted/60 hover:text-destructive sm:px-3.5"
                onClick={handleLogout}
                disabled={logout.isPending}
                aria-label="Keluar dari portal"
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">{logout.isPending ? 'Keluar…' : 'Keluar'}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {subtitle && (
        <p className="truncate border-t border-primary/5 px-3 pb-2.5 pt-1.5 text-xs text-muted-foreground sm:px-6 sm:text-sm">
          {subtitle}
        </p>
      )}
    </header>
  )
}
