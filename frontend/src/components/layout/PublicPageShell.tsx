import type { ReactNode } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

interface PublicPageShellProps {
  children: ReactNode
}

export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
