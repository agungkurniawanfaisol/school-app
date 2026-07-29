import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PmbPortalBottomNav } from '@/components/layout/PmbPortalBottomNav'
import { PmbPortalHeader } from '@/components/layout/PmbPortalHeader'
import { PmbPortalSidebar } from '@/components/layout/PmbPortalSidebar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  isPmbRegistrationCorrectionAllowed,
  isPmbRegistrationReadonly,
} from '@/config/pmb-portal-nav'
import { usePmbPortalRegistration } from '@/hooks/usePmb'
import { useSchool } from '@/hooks/useSchool'
import { getAuthToken, getStoredUser, hasPortalAuth } from '@/lib/api'
import { PMB_PORTAL_MAIN_PB } from '@/lib/pmb-portal-layout'
import { cn } from '@/lib/utils'

export function PmbPortalLayout() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const token = getAuthToken()
  const user = getStoredUser()
  const isPendaftar = user?.role === 'pendaftar'
  const isAuthenticated = hasPortalAuth()
  const { data: school } = useSchool()
  const { data: registration } = usePmbPortalRegistration(school?.id)

  const isDetailRoute = pathname.startsWith('/pmb/portal/')
  const isRegisterRoute = pathname === '/pmb/daftar'
  const isReadonly = isPmbRegistrationReadonly(registration?.status)
  const isCorrection = isPmbRegistrationCorrectionAllowed(registration?.status)

  if (token && user && !isPendaftar) {
    return <Navigate to="/admin" replace />
  }

  if (isDetailRoute && !isAuthenticated) {
    return <Navigate to="/pmb/daftar" replace />
  }

  if (isDetailRoute && isAuthenticated && registration?.status === 'draft') {
    return <Navigate to="/pmb/daftar" replace />
  }

  const pageTitle = isRegisterRoute
    ? isCorrection
      ? 'Perbaiki Data'
      : isReadonly
        ? 'Data Pendaftaran'
        : 'Pendaftaran PMB'
    : 'Status Pendaftaran'
  const pageSubtitle = isRegisterRoute
    ? isCorrection
      ? 'Perbarui data atau bukti transfer, lalu kirim perbaikan'
      : isReadonly
        ? 'Ringkasan data yang sudah dikirim (hanya lihat)'
        : 'Lengkapi data calon siswa secara bertahap'
    : 'Pantau proses pendaftaran anak Anda'

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#pmb-portal-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Lewati ke konten
      </a>

      <PmbPortalSidebar
        isAuthenticated={isAuthenticated}
        registration={registration}
        className="fixed inset-y-0 left-0 z-30 hidden h-dvh lg:flex"
      />

      <div className={cn('flex min-h-dvh flex-col lg:pl-72')}>
        <PmbPortalHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          isAuthenticated={isAuthenticated}
          onOpenMenu={() => setMobileOpen(true)}
        />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[min(100%,18rem)] max-w-[85vw] border-0 p-0 [&>button]:right-3 [&>button]:top-[max(0.75rem,env(safe-area-inset-top))] [&>button]:z-50 [&>button]:text-[var(--sidebar-text)] [&>button]:opacity-90 [&>button]:hover:opacity-100"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menu Portal PMB</SheetTitle>
            </SheetHeader>
            <PmbPortalSidebar
              isAuthenticated={isAuthenticated}
              registration={registration}
              onNavigate={() => setMobileOpen(false)}
              className="h-full w-full border-0 shadow-none"
            />
          </SheetContent>
        </Sheet>

        <main
          id="pmb-portal-main"
          className={cn(
            'pmb-portal-content flex-1 overflow-x-hidden overflow-y-auto px-3 py-4',
            PMB_PORTAL_MAIN_PB,
          )}
        >
          <Outlet context={{ registration, isAuthenticated }} />
        </main>

        <PmbPortalBottomNav isAuthenticated={isAuthenticated} registration={registration} />
      </div>
    </div>
  )
}
