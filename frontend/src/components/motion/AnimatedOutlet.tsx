import { Outlet, useLocation } from 'react-router-dom'
import { MotionTierProvider } from './MotionTierContext'
import { PageEnter } from './PageEnter'
import type { MotionTier } from '@/lib/motion'

function getMotionTier(pathname: string): MotionTier {
  if (pathname === '/') return 'full'
  if (pathname === '/admin/login' || pathname === '/pmb/daftar') return 'none'
  if (pathname.startsWith('/admin')) return 'none'
  return 'lite'
}

export function AnimatedOutlet() {
  const { pathname } = useLocation()
  const tier = getMotionTier(pathname)

  const content = <Outlet />

  return (
    <MotionTierProvider tier={tier}>
      {tier === 'lite' ? <PageEnter tier="lite">{content}</PageEnter> : content}
    </MotionTierProvider>
  )
}
