import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'nh_admin_sidebar_collapsed'
const FLYOUT_CLOSE_DELAY_MS = 150

export type AdminFlyoutTarget = 'dashboard' | (string & {})

type AdminSidebarContextValue = {
  collapsed: boolean
  flyoutTarget: AdminFlyoutTarget | null
  flyoutTop: number
  toggleCollapsed: () => void
  setCollapsed: (value: boolean) => void
  openFlyout: (target: AdminFlyoutTarget, top: number) => void
  closeFlyout: () => void
  scheduleCloseFlyout: () => void
  cancelCloseFlyout: () => void
  sidebarWidthClass: string
  contentOffsetClass: string
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null)

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(readCollapsed)
  const [flyoutTarget, setFlyoutTarget] = useState<AdminFlyoutTarget | null>(null)
  const [flyoutTop, setFlyoutTop] = useState(0)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      /* ignore */
    }
    if (value) {
      setFlyoutTarget(null)
    }
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed, setCollapsed])

  const openFlyout = useCallback((target: AdminFlyoutTarget, top: number) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setFlyoutTarget(target)
    setFlyoutTop(top)
  }, [])

  const closeFlyout = useCallback(() => {
    setFlyoutTarget(null)
  }, [])

  const scheduleCloseFlyout = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = setTimeout(() => {
      setFlyoutTarget(null)
      closeTimerRef.current = null
    }, FLYOUT_CLOSE_DELAY_MS)
  }, [])

  const cancelCloseFlyout = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const value = useMemo<AdminSidebarContextValue>(
    () => ({
      collapsed,
      flyoutTarget,
      flyoutTop,
      toggleCollapsed,
      setCollapsed,
      openFlyout,
      closeFlyout,
      scheduleCloseFlyout,
      cancelCloseFlyout,
      sidebarWidthClass: collapsed ? 'w-16' : 'w-72',
      contentOffsetClass: collapsed ? 'lg:pl-16' : 'lg:pl-72',
    }),
    [
      collapsed,
      flyoutTarget,
      flyoutTop,
      toggleCollapsed,
      setCollapsed,
      openFlyout,
      closeFlyout,
      scheduleCloseFlyout,
      cancelCloseFlyout,
    ],
  )

  return <AdminSidebarContext.Provider value={value}>{children}</AdminSidebarContext.Provider>
}

export function useAdminSidebar(): AdminSidebarContextValue {
  const ctx = useContext(AdminSidebarContext)
  if (!ctx) {
    throw new Error('useAdminSidebar must be used within AdminSidebarProvider')
  }
  return ctx
}
